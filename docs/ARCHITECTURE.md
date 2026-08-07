# EduCore Architecture

## Architecture Style

EduCore follows a layered architecture to ensure separation of concerns, maintainability, and scalability.

```
React Client
       │
       ▼
REST API
(Node.js + Express.js)
       │
       ▼
Controllers
       │
       ▼
Services
       │
       ▼
Prisma ORM
       │
       ▼
PostgreSQL
```

---

# Technology Stack

## Frontend

- React
- React Router
- Axios
- Tailwind CSS

---

## Backend

- Node.js
- Express.js

---

## Database

- PostgreSQL

---

## ORM

- Prisma

---

## Authentication

- JSON Web Token (JWT)
- bcrypt

---

## API Style

- RESTful API
- JSON Request/Response

---

# Layer Responsibilities

## Client Layer

Responsible for:

- User Interface
- Forms
- Routing
- API Requests

---

## Controller Layer

Responsible for:

- Receiving HTTP Requests
- Validating Input
- Calling Services
- Returning HTTP Responses

Controllers should not contain business logic.

---

## Service Layer

Responsible for:

- Business Logic
- Data Processing
- Calling Prisma

This is where the application's core logic lives.

---

## Prisma Layer

Responsible for:

- Database Queries
- CRUD Operations
- Managing Relationships

---

## Database Layer

Responsible for:

- Data Storage
- Relationships
- Constraints
- Indexes

---

# Authentication Flow

1. User logs in.
2. Server verifies credentials.
3. JWT token is generated.
4. Client stores the token.
5. Every protected request includes the token.
6. Server verifies the token before granting access.

---

# Authorization

EduCore uses Role-Based Access Control (RBAC).

Supported roles:

- Administrator
- Teacher
- Student

Each role has different permissions.

---

# Design Principles

- Separation of Concerns
- Single Responsibility Principle
- RESTful API Design
- Scalable Architecture
- Clean Code
- Modular Development

---

# Future Improvements

The architecture should support future enhancements, including:

- Redis Caching
- Docker Deployment
- AI Assistant Integration
- Email Notifications
- Real-Time Notifications
- Mobile Application Support