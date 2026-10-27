# ChatyPilot
AI chat backend with JWT auth, saved conversations and PDF Q&amp;A using a RAG pipeline (chunking, embeddings, cosine-similarity search) built with Node.js, Express, MySQL and the Gemini API.

ChatyPilot is a Node.js backend for an AI chat application. Users can register, log in, and chat with an LLM, with every conversation saved to their account. They can also upload PDFs and ask questions about them: the app splits each PDF into chunks, creates embeddings, finds the most relevant chunks by cosine similarity, and sends them to the model so answers come from the documents, with the sources returned.

Features

JWT authentication with per-user conversations and documents
Chat history and auto-generated conversation titles
Multi-PDF upload with text extraction and chunking
Retrieval-augmented answers with source references
Provider layer for multiple LLM APIs (Gemini integrated)

Tech stack: Node.js, Express, MySQL, Sequelize, JWT, Multer, Gemini API


## Run locally

**Prerequisites**
- Node.js 20 or later
- MySQL 8 or later
- A Gemini API key from Google AI Studio

**Setup**

```bash
git clone https://github.com/Mohd-Aadil/chatypilot.git
cd chatypilot
npm install
cp .env.example .env
```

Open `.env` and fill in your values (database details, `JWT_SECRET`, `GEMINI_API_KEY`).

Create the database (the app creates the tables on first start):

```sql
CREATE DATABASE chatypilot;
```

**Start the server**

```bash
npm start
```

The API runs at `http://localhost:<PORT>/api`. The app stops at startup with a clear error if a required environment variable is missing.

**Quick test**

```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login (returns a token)
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
