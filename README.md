# Travel Assistant App

A simple full-stack AI-powered travel assistant built with **FastAPI** (backend) and **Next.js/React** (frontend). Users can ask travel-related questions and receive intelligent responses powered by OpenAI.

---

## Project Structure

```
travel-assistant/
├── backend/
|──app/
│   ├── main.py
│── .env
│── requirements.txt
├── frontend/
│   ├── src/app/
│      └── page.tsx
│       └──components
│           ├──chatInput.tsx
│            ├──chatSidebar.tsx
│            ├──chatWindow.tsx
│── services/
        ├── api.ts
│── types/
        ├── index.ts
│── public/
│── ...
```

---

##  Backend Setup (FastAPI)

###  Requirements

- Python 3.9+
- pip

###  Installation Steps

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows CMD)
venv\Scripts\activate

# Or with PowerShell
venv\Scripts\Activate.ps1

# Install FastAPI and dependencies
pip install fastapi uvicorn
pip install fastapi[all]
pip install openai==0.28
pip install python-dotenv

# Save installed packages
pip freeze > requirements.txt
```

###  Environment Configuration

Create a `.env` file in the `backend/` folder:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

###  Running the API Server

```bash
uvicorn app.main:app --reload --port 8000
```

API will be accessible at: `http://localhost:8000`

---

##  Frontend Setup (Next.js)

###  Requirements

- Node.js 18+
- npm or yarn

###  Installation

```bash
cd frontend
npm install
```

###  Running the Development Server

```bash
npm run dev
```

Frontend will be accessible at: [http://localhost:3000](http://localhost:3000)

---

##  Features

- Ask travel questions and get real-time AI-powered responses.
- Loading indicator with centered spinner and message.
- Clear input button adjacent to the "Submit" button.
- Responsive and clean interface.
- **(Planned)**: Conversation history per thread.

---

API Endpoints
GET
/
Welcome endpoint
POST
/threads
Create a new chat thread
GET
/threads
List all chat threads
GET
/threads/{thread_id}
Get all messages for a specific thread
POST
/chat
Submit a travel question to a specific thread
DELETE
/threads/{thread_id}
Delete a specific thread and all its messages




##PROMPTS:
- What documents do I need to travel from kenya to Ireland?
- Tell me a dad joke.
---

