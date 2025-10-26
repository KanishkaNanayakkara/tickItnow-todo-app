# 🧩 TickItNow - To-Do Task Application

A full-stack To-Do web application built as part of the **Full Stack Engineer / Intern Take-Home Assessment**.  
This project allows users to **create, view, edit, and complete tasks** via a simple and clean UI.

---

## 📘 Table of Contents
- [🧠 Overview](#-overview)
- [🏗️ Architecture](#-architecture)
- [⚙️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Setup Instructions](#-setup-instructions)
  - [🧩 Prerequisites](#-prerequisites)
  - [🐳 Running with Docker Compose](#-running-with-docker-compose)
  - [🧠 Running Locally (Optional)](#-running-locally-optional)
- [🔐 Environment Variables](#-environment-variables)
- [🔗 API Endpoints](#-api-endpoints)
- [🧪 Testing](#-testing)
- [🖼️ Screenshots](#-screenshots)

---

## 🧠 Overview

This is a **3-tier full-stack To-Do web application** that enables users to:  

- ➕ **Create tasks** with a title and description.  
- ✏️ **Edit existing tasks** to update their title or description.  
- 👀 **View only the 5 most recent uncompleted tasks.**  
- ✅ **Mark tasks as completed**, which removes them from the visible list.  

All application components (**Frontend**, **Backend**, **Database**) are **containerized using Docker** and orchestrated with **Docker Compose** for simple setup and deployment.

---

## 🏗️ Architecture

```
                       ┌──────────────────────┐
                       │      Frontend        │
                       │   React + TypeScript │
                       │     (Port: 3000)    │
                       └──────────┬──────────┘
                                  │
                         REST API calls (HTTP)
                                  │
                       ┌──────────▼───────────┐
                       │      Backend         │
                       │   Spring Boot (Java) │
                       │     (Port: 8080)     │
                       └──────────┬───────────┘
                                  │
                          JDBC Connection
                                  │
                       ┌──────────▼───────────┐
                       │      Database        │
                       │  PostgreSQL (Port:5432) │
                       └──────────────────────┘
```

---

## ⚙️ Tech Stack

### Frontend
- React (TypeScript)  
- Axios (for API requests)  
- TailwindCSS  
- Cypress (E2E testing)  
- Vitest + React Testing Library (unit/component testing)  

### Backend
- Java 21  
- Spring Boot  
- PostgreSQL Driver  
- JUnit 5 + Mockito (unit tests)  
- H2 Database (integration tests)  
- Maven (build tool)  

### Database
- PostgreSQL  

### Containerization
- Docker  
- Docker Compose  

---

## 📁 Project Structure

```
📦 todo-app
├── 📂 backend
│   ├── 📂 src/main/java/com/example/todo
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── model/
│   ├── 📂 src/test/java/com/example/todo
│   ├── pom.xml
│   └── Dockerfile
│
├── 📂 frontend
│   ├── 📂 src/
│   ├── 📂 public/
│   ├── 📂 cypress/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .env
```

---

## 🚀 Setup Instructions

### 🧩 Prerequisites
- Docker  
- Docker Compose  
- (Optional) Node.js & npm (for local frontend dev)  
- (Optional) Java 21 + Maven (for local backend dev)  

---

### 🐳 Running with Docker Compose

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
./start.sh
```

Access the application:  
- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend API: [http://localhost:8080/tasks](http://localhost:8080/tasks)  
- Database: `localhost:5432`  

---

### 🧠 Running Locally (Optional)

**Backend**
```bash
cd backend
mvn install
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:8080
```

Replace placeholder values with actual credentials as needed.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | /tasks  | Create a new task |
| GET    | /tasks  | Get 5 most recent uncompleted tasks |
| PUT    | /tasks/{id} | Mark a task as completed |
| PATCH  | /tasks/{id} | Update a task’s title and/or description |

**Example Request (POST):**
```json
POST /api/tasks
{
  "title": "Write README",
  "description": "Create detailed project documentation"
}
```

---

## 🧪 Testing

### ✅ Backend Unit & Integration Tests
- **Frameworks:** JUnit 5, Mockito  
- **Integration Testing:** H2 in-memory database simulates PostgreSQL  

**Run tests:**
```bash
cd backend
./mvnw test
```

---

### 🧩 Frontend Unit & Component Tests
- **Framework:** Vitest + React Testing Library  
- **Scope:** Tests UI components and business logic  

**Run tests:**
```bash
cd frontend
npm test
```

---

### 🌐 End-to-End Tests (Cypress)
```bash
cd frontend
npx cypress open   # Interactive mode
# or
npx cypress run    # Headless mode
```

---

## 🖼️ Screenshots
*(Add screenshots or GIFs after running the app — e.g., task creation, task list view, editing tasks, etc.)*  
- Create Task  
- Task List  
- Edit Task