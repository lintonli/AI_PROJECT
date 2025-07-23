from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

import openai
import os


load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
# print("OPENAI_API_KEY loaded:", os.getenv("OPENAI_API_KEY"))


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello, welcome to the Travel Assistant API!"}

class TravelQuery(BaseModel):
    question: str

@app.post("/travel-info")
def get_travel_info(query: TravelQuery):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful travel documentation assistant."},
                {"role": "user", "content": query.question}
            ]
        )
        answer = response.choices[0].message["content"].strip()
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
