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

## 🔐 Environment Variables

Create a `.env` file in the frontend following the sample .env file:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:8080
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

> * The application build and run processes are fully containerized (no Java or Node required).
> * Unit and integration tests are available for both frontend and backend.
> * Tests can be executed locally.

### ✅ Backend Unit & Integration Tests
- **Frameworks:** JUnit , Mockito  
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

- Initial View

<img width="1863" height="858" alt="image" src="https://github.com/user-attachments/assets/670130d1-a1af-430d-996e-7bb78f020100" />

- Create Task
  
<img width="1886" height="897" alt="image" src="https://github.com/user-attachments/assets/e3e1e3ce-9253-4156-a875-f786301612c1" />

- Edit Task
  
<img width="1876" height="869" alt="image" src="https://github.com/user-attachments/assets/a98c6ffc-475f-4957-be99-886a39281bbf" />

- Task List

<img width="1884" height="904" alt="image" src="https://github.com/user-attachments/assets/e4dfbbe5-60dc-49c1-b3a3-1ab90784781e" />

- Loading State
  
<img width="1657" height="878" alt="image" src="https://github.com/user-attachments/assets/255fdaad-97a1-4490-a49e-feab825e0519" />

- Error State

<img width="1862" height="885" alt="image" src="https://github.com/user-attachments/assets/82b92794-eb94-4dc3-a85a-07eeafa4b6a7" />
