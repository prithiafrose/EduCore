# Software Requirements Specification (SRS)

# EduCore

Version: 1.0

---

# 1. Introduction

## 1.1 Purpose

EduCore is a web-based University ERP (Enterprise Resource Planning) System that digitizes academic and administrative activities within a university. The system enables administrators, teachers, and students to perform their daily tasks efficiently through a centralized platform.

---

## 1.2 Scope

EduCore provides essential university management features, including:

- User Authentication
- Student Management
- Teacher Management
- Department Management
- Course Management
- Course Registration
- Timetable Management
- Attendance Management
- Assignment Management
- Result Management
- Notice Board
- Fee & Payment Management
- Dashboard & Reports

The system is designed to support multiple departments while remaining scalable for future expansion.

---

## 1.3 Objectives

The objectives of EduCore are:

- Simplify university administration
- Improve communication between students and teachers
- Digitize academic records
- Reduce manual paperwork
- Provide secure role-based access
- Support future scalability

---

# 2. Stakeholders

- University Administration
- Teachers
- Students

---

# 3. User Roles

## Administrator

Responsible for managing the overall system.

## Teacher

Responsible for managing academic activities.

## Student

Responsible for accessing academic services.

---

# 4. Functional Requirements

The system shall allow:

- User Authentication
- Role-Based Authorization
- Student Management
- Teacher Management
- Department Management
- Course Management
- Course Registration
- Timetable Management
- Attendance Management
- Assignment Management
- Result Management
- Notice Management
- Payment Management
- Dashboard Generation

---

# 5. Non-Functional Requirements

The system should provide:

- Security
- Scalability
- High Availability
- Maintainability
- Performance
- Data Integrity
- Responsive User Interface

---

# 6. Assumptions

- Users have internet access.
- Each user has a unique university ID.
- PostgreSQL is used as the primary database.

---

# 7. Constraints

- RESTful API Architecture
- JWT Authentication
- PostgreSQL Database
- Node.js Backend
- React Frontend