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
│   │   └── page.tsx
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
.venv\Scripts\Activate.ps1

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

### ▶ Running the API Server

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

## 📡 API Endpoints

| Method | Endpoint             | Description                              |
|--------|----------------------|------------------------------------------|
| `POST` | `/travel-info`       | Submit a travel question and get a response |

---

##  TODO

- [ ] Implement backend storage of `thread_id` conversation history
- [ ] Display previous messages on frontend
- [ ] Add persistent DB (SQLite, PostgreSQL, or MongoDB)

##PROMPTS:
- What documents do I need to travel from kenya to Ireland?
- Tell me a dad joke.
---

