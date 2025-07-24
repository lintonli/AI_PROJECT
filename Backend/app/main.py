from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
import sqlite3

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Setup DB connection
conn = sqlite3.connect("chat_threads.db", check_same_thread=False)
cursor = conn.cursor()

# Create tables
cursor.execute("""
CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT 'Untitled'
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(thread_id) REFERENCES threads(id)
)
""")
conn.commit()

# FastAPI app setup
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class MessageRequest(BaseModel):
    thread_id: int
    question: str

class ThreadCreate(BaseModel):
    title: str 

# Root
@app.get("/")
def read_root():
    return {"message": "Welcome to the Travel Assistant API with Threads!"}


@app.post("/threads")
def create_thread(thread: ThreadCreate):
    cursor.execute("INSERT INTO threads (title) VALUES (?)", (thread.title,))
    conn.commit()
    thread_id = cursor.lastrowid
    return {"thread_id": thread_id, "title": thread.title}


@app.get("/threads")
def list_threads():
    cursor.execute("SELECT id, title FROM threads ORDER BY id DESC")
    return [{"id": row[0], "title": row[1]} for row in cursor.fetchall()]


@app.get("/threads/{thread_id}")
def get_thread_messages(thread_id: int):
    cursor.execute("SELECT role, content FROM messages WHERE thread_id = ? ORDER BY id ASC", (thread_id,))
    messages = [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]
    return {"thread_id": thread_id, "messages": messages}


@app.post("/chat")
def chat_with_thread(request: MessageRequest):
    try:
        # Fetch prior messages
        cursor.execute("SELECT role, content FROM messages WHERE thread_id = ? ORDER BY id", (request.thread_id,))
        history = [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]
        
        # Add current user message
        history.append({"role": "user", "content": request.question})

        # Chat completion
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful travel documentation assistant."}
            ] + history
        )
        answer = response.choices[0].message["content"].strip()

        # Save user message
        cursor.execute(
            "INSERT INTO messages (thread_id, role, content) VALUES (?, ?, ?)",
            (request.thread_id, "user", request.question)
        )
        # Save assistant response
        cursor.execute(
            "INSERT INTO messages (thread_id, role, content) VALUES (?, ?, ?)",
            (request.thread_id, "assistant", answer)
        )
        conn.commit()

        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
#delete thread
@app.delete("/threads/{thread_id}")
def delete_thread(thread_id: int):
    try:
        # Delete messages first (foreign key constraint)
        cursor.execute("DELETE FROM messages WHERE thread_id = ?", (thread_id,))
        # Delete thread
        cursor.execute("DELETE FROM threads WHERE id = ?", (thread_id,))
        conn.commit()
        
        # Check if anything was deleted
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Thread not found")
            
        return {"message": "Thread deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
