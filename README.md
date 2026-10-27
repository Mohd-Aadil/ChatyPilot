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
