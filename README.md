# DevBoard - REST API & Backend System ⚙️

This repository houses the backend architecture for the DevBoard application. It is a secure, fully-featured RESTful API built to handle user authentication, database management, and third-party AI service integrations.

🔗 **Live API Base URL:** [https://devboard-backend-khbj.onrender.com](https://devboard-backend-khbj.onrender.com)

💻 **Frontend Repository:** [https://github.com/Princej04/devboard-frontend](https://github.com/Princej04/devboard-frontend)

## Tech Stack & Architecture
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted via Supabase)
* **ORM:** Prisma
* **Authentication:** JSON Web Tokens (JWT) & bcrypt (Password Hashing)
* **AI Integration:** Google Gemini API
* **Deployment:** Render

## Security Features
* **CORS Whitelisting:** Strictly configured to only accept requests from the designated Vercel frontend and local development environments.
* **Credential Protection:** Passwords are mathematically hashed via `bcrypt` before being stored in the database.
* **Protected Routes:** Middleware enforces standard `Bearer` token verification for all sensitive endpoints.

## Local Setup

To run this server on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Princej04/devboard-backend.git
   cd devboard-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your secure keys:
   ```env
   DATABASE_URL="your_supabase_postgresql_connection_string"
   JWT_SECRET="your_custom_secret_key"
   GEMINI_API_KEY="your_google_ai_studio_key"
   PORT=5000
   ```

4. **Initialize the Database:**
   Generate the Prisma client and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Server:**
   ```bash
   npm start
   ```

## 📡 Core API Routes

### Authentication
* `POST /api/auth/register` - Create a new user account
* `POST /api/auth/login` - Authenticate and receive JWT

### Kanban Board (Protected)
* `GET /api/kanban` - Fetch all user tasks
* `POST /api/kanban` - Create a new task card
* `PATCH /api/kanban/:id` - Update task status/column
* `DELETE /api/kanban/:id` - Remove a task

### AI Insights (Protected)
* `POST /api/ai/suggest` - Ping Gemini API for task generation