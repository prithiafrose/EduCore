# EduCore — Entity Relationship Diagram

## Entity Relationship Overview

Department
    |
    | 1
    |
    |------< Program
                |
                | 1
                |
                |------< AcademicSemester
                              |
                              |------< AcademicPeriod
                              |
                              |------< CourseOffering
                              |
                              |------< PaymentPeriod

Course
    |
    | 1
    |
    |------< CourseOffering
                    |
                    |------< Enrollment >------ Student
                    |
                    |------< Timetable
                    |          |
                    |          |------< ClassSession
                    |                         |
                    |                         |------< Attendance
                    |
                    |------< Assignment
                               |
                               |------< Submission

User
    |
    |------ Student
    |
    |------ Teacher

Enrollment
    |
    |------ Result

Student
    |
    |------ Payment

PaymentPeriod
    |
    |------ Payment
Course
   │
   │ 1
   ▼
CourseOffering

CourseOffering
      │
      └────── Section (optional)
User
 │
 ├──── 1:1 ──── Student
 │
 └──── 1:1 ──── Teacher
AcademicSemester
       │
       │ 1
       ▼
PaymentPeriod
       │
       │ 1
       ▼
Payment
       │
       │
       ▼
Student
CourseOffering
       │
       │ 1
       ▼
Assignment
       │
       │ 1
       ▼
Submission
       │
       ▼
Student
Timetable
    │
    ▼
ClassSession
    │
    │ 1
    ▼
Attendance
    ▲
    │
 Student
Student
   │
   │ 1
   ▼
Enrollment
   ▲
   │ 1
   │
CourseOffering
Student
   │
   ▼
Submission
   ▲
   │
Assignment