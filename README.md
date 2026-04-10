# 🤖 Telegram AI Agent (Ollama + Skills System)

A lightweight, fully local-first AI agent powered by Telegram, Ollama, and modular Skills (prompt templates).

## 🚀 Features
- Local AI via Ollama (no API costs)
- Telegram bot interface
- Skill-based prompting system
- Per-user skill switching
- Fully private execution

## 🧠 Architecture
Telegram → Node.js Bot → Skill Loader → Ollama → Response → Telegram

## 🛠️ Setup

### Install dependencies
npm install

### Install Ollama
brew install ollama
ollama serve
ollama pull llama3

### Run bot
node index.js

## 💬 Commands
/start
/skill frontend-design

## 🧩 Skills
Stored in:
.agents/skills/<skill-name>/SKILL.md

## 🚀 Example
Build a modern fintech landing page


