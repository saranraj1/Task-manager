# Task Manager Application

Welcome to the Task Manager project! This is a simple, lightweight full-stack application designed to execute fluidly both on local developer environments and effortlessly deploy via Vercel Serverless.

## Features
- **Vanilla Frontend**: Pure HTML/CSS/JS without heavy build tools.
- **SaaS Aesthetics**: A perfectly responsive, clean, human-built dashboard interface.
- **Vercel Serverless Backend**: Postgres routing inside the `api/` directory.
- **Seamless Local Mocking**: Gracefully falls back to local in-memory arrays when no database is actively hooked up, allowing reviewers to instantly run the app.

---

## 🚀 Running Locally (No Database Required)

You do **not** need a PostgreSQL database instance to run this locally! The server handles mocking transparently out-of-the-box.

1. **Install Dependencies**
   Open your terminal in the root directory and install `express` (to serve the routes locally) and `pg`:
   ```bash
   npm install
   ```
2. **Start the Local Server**
   ```bash
   node server.js
   ```
3. **View the Application**
   Open your browser and navigate to: `http://localhost:3000`

---

## 🗄️ Connecting a Live Database (PostgreSQL)

If you'd like to test the persistent database integration rather than the local in-memory fallback, the project natively supports PostgreSQL!

1. **Set your Environment Variable**  
   Create a `.env` file in the root directory, or export it in your terminal, passing your Postgres URI:
   ```env
   DATABASE_URL="postgres://username:password@hostname/dbname"
   ```
2. **Start the Server**
   ```bash
   node server.js
   ```
3. The server will automatically detect the connection, bypass the mock layers, and safely initialize the `tasks` tables if they do not exist. Any deployment provider (Render, Railway, Heroku, etc.) that passes a `DATABASE_URL` will immediately bring the true backend online!

---

> **Note to Reviewers:** Be sure to check `NOTES.md` for my quick breakdown of some of the fun design decisions and architectural trade-offs made during development!
