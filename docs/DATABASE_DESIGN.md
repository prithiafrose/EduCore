# EduCore — Database Design

## 1. Overview

EduCore is a university academic management system designed to manage students, teachers, courses, academic semesters, class schedules, attendance, assignments, results, payments, and notices.

The initial implementation focuses on one department, but the database is designed so that additional departments and programs can be supported later.

---

## 2. Database Technology

* **Database:** PostgreSQL
* **ORM:** Prisma
* **Backend:** Node.js + Express.js
* **Primary Key:** UUID
* **Date/Time:** Stored using database-supported date/time types
* **Authentication:** User-based authentication with role-based authorization

---

# 3. Entity Overview

EduCore contains the following major entities:

1. User
2. Student
3. Teacher
4. Department
5. Program
6. AcademicSemester
7. AcademicPeriod
8. Course
9. CourseOffering
10. Section
11. Enrollment
12. Timetable
13. ClassSession
14. Attendance
15. Assignment
16. Submission
17. Result
18. PaymentPeriod
19. Payment
20. Notice

---

# 4. Entity Design

## 4.1 User

Stores authentication and authorization information.

### Fields

* `id`
* `email`
* `passwordHash`
* `role`
* `isActive`
* `createdAt`
* `updatedAt`

### Roles

* `STUDENT`
* `TEACHER`
* `ADMIN`

### Relationships

* A User may have one Student profile.
* A User may have one Teacher profile.

Authentication information is stored in `User` rather than duplicated in Student or Teacher.

---

## 4.2 Student

Stores student academic and personal information.

### Fields

* `id`
* `userId`
* `studentId`
* `fullName`
* `phone`
* `dateOfBirth`
* `programId`
* `academicSemesterId`
* `sectionId` — optional
* `admissionYear`
* `createdAt`
* `updatedAt`

### Example

```text
Student ID: 20223301
Name: Rahim
Email: rahim@example.com
Phone: 017XXXXXXXX
Program: BSc in Software Engineering
Year: 3
Semester: 1
Section: A
```

The student's email is obtained from the related `User` record.

### Relationships

* Belongs to one User.
* Belongs to one Program.
* Belongs to one AcademicSemester.
* May belong to one Section.
* Has many Enrollments.
* Has many Attendance records.
* Has many Submissions.
* Has many Payments.
### Student Academic Semester

A Student stores an `academicSemesterId` representing the student's
current academic semester.

For the initial version of EduCore, this provides simple access to
the student's current academic position.

Future versions may introduce a StudentAcademicHistory entity to
preserve the student's complete semester-by-semester academic history.

---

## 4.3 Teacher

Stores teacher information.

### Fields

* `id`
* `userId`
* `employeeId`
* `fullName`
* `designation`
* `departmentId`
* `phone`
* `createdAt`
* `updatedAt`

### Relationships

* Belongs to one User.
* Belongs to one Department.
* Can teach multiple CourseOfferings.

Authentication information is stored in `User`.

---

## 4.4 Department

Represents an academic department.

### Fields

* `id`
* `name`
* `code`
* `createdAt`
* `updatedAt`

### Relationships

* A Department has many Programs.
* A Department has many Teachers.

### Example

```text
Software Engineering
SWE
```

---

## 4.5 Program

Represents an academic degree/program.

### Fields

* `id`
* `name`
* `code`
* `departmentId`
* `durationYears`
* `createdAt`
* `updatedAt`

### Relationships

* Belongs to one Department.
* Has many Students.
* Has many AcademicSemesters.
* Has many Sections.

### Example

```text
BSc in Software Engineering
BSWE
4 years
```

---

## 4.6 AcademicSemester

Represents one academic level within a Program.

EduCore follows the university's structure:

```text
1st Year - 1st Semester
1st Year - 2nd Semester

2nd Year - 1st Semester
2nd Year - 2nd Semester

3rd Year - 1st Semester
3rd Year - 2nd Semester

4th Year - 1st Semester
4th Year - 2nd Semester
```

### Fields

* `id`
* `programId`
* `yearNumber`
* `semesterNumber`
* `name`
* `createdAt`
* `updatedAt`

### Relationships

* Belongs to one Program.
* Has many AcademicPeriods.
* Has many CourseOfferings.
* Has many Students.
* Has many PaymentPeriods.

The eight semesters are stored as records in one table rather than as eight separate tables.

---

## 4.7 AcademicPeriod

Represents a specific period within an academic semester.

### Possible Types

* `CLASS`
* `MIDTERM_1`
* `MIDTERM_2`
* `FINAL_EXAM`

### Fields

* `id`
* `academicSemesterId`
* `type`
* `startDate`
* `endDate`

### Relationships

* Belongs to one AcademicSemester.

### Example

```text
3rd Year - 1st Semester

CLASS
MIDTERM_1
CLASS
MIDTERM_2
CLASS
FINAL_EXAM
```

The exact dates are configurable rather than hard-coded.

---

## 4.8 Course

Represents an academic subject.

### Fields

* `id`
* `code`
* `name`
* `credit`
* `description`
* `createdAt`
* `updatedAt`

### Example

```text
Code: SWE 311
Name: Database Management Systems
Credit: 3
```

### Relationships

* A Course can have many CourseOfferings.

---

## 4.9 CourseOffering

Represents a Course being offered during a specific AcademicSemester.

### Fields

* `id`
* `courseId`
* `academicSemesterId`
* `teacherId`
* `sectionId` — optional
* `capacity`
* `createdAt`
* `updatedAt`

### Relationships

* Belongs to one Course.
* Belongs to one AcademicSemester.
* Belongs to one Teacher.
* May belong to one Section.
* Has many Enrollments.
* Has many Timetables.
* Has many Assignments.

### Example

```text
Database Management Systems
3rd Year - 1st Semester
Teacher: Dr. Rahman
Section: A
Capacity: 40
```

---

## 4.10 Section

Represents an academic section where the department uses a section system.

### Fields

* `id`
* `name`
* `programId`
* `createdAt`
* `updatedAt`

### Examples

```text
Section A
Section B
```

Section is optional because some departments may not use sections.

A CourseOffering can therefore exist with or without a Section.

---

## 4.11 Enrollment

Represents a student's registration in a CourseOffering.

### Fields

* `id`
* `studentId`
* `courseOfferingId`
* `status`
* `enrolledAt`
* `droppedAt`

### Status

* `ENROLLED`
* `DROPPED`
* `COMPLETED`

### Relationships

* Belongs to one Student.
* Belongs to one CourseOffering.
* Can have one Result.

Enrollment acts as the bridge between Student and CourseOffering.

```text
Student >──── Enrollment ────< CourseOffering
```

---

## 4.12 Timetable

Represents the recurring weekly schedule for a CourseOffering.

### Fields

* `id`
* `courseOfferingId`
* `dayOfWeek`
* `startTime`
* `endTime`
* `room`
* `createdAt`

### Relationships

* Belongs to one CourseOffering.
* Has many ClassSessions.

### Academic Rules

According to the current university requirements:

```text
2-credit course → 2 classes per week
3-credit course → 3 classes per week
Each class → approximately 1 hour
```

These rules should be validated by the backend where appropriate.

---

## 4.13 ClassSession

Represents an actual occurrence of a scheduled class.

### Fields

* `id`
* `timetableId`
* `date`
* `status`
* `cancellationReason`
* `createdAt`

### Status

* `SCHEDULED`
* `ONGOING`
* `COMPLETED`
* `CANCELLED`

### Relationships

* Belongs to one Timetable.
* Has many Attendance records.

This entity allows EduCore to distinguish between:

* Upcoming classes
* Completed classes
* Cancelled classes
* Ongoing classes

---

## 4.14 Attendance

Stores a student's attendance for a specific ClassSession.

### Fields

* `id`
* `classSessionId`
* `studentId`
* `status`
* `markedAt`
* `markedBy`

### Status

* `PRESENT`
* `ABSENT`
* `LATE`

### Relationships

* Belongs to one ClassSession.
* Belongs to one Student.

---

## 4.15 Assignment

Represents an assignment given for a CourseOffering.

### Fields

* `id`
* `courseOfferingId`
* `title`
* `description`
* `dueDate`
* `attachmentUrl`
* `createdAt`
* `updatedAt`

### Relationships

* Belongs to one CourseOffering.
* Has many Submissions.

---

## 4.16 Submission

Represents a student's submission for an Assignment.

### Fields

* `id`
* `assignmentId`
* `studentId`
* `fileUrl`
* `submittedAt`
* `marks`
* `feedback`
* `gradedAt`

### Relationships

* Belongs to one Assignment.
* Belongs to one Student.

---

## 4.17 Result

Stores the result of a student for an enrolled course.

### Fields

* `id`
* `enrollmentId`
* `marks`
* `grade`
* `gradePoint`
* `publishedAt`

### Relationships

* Belongs to one Enrollment.

---

# 4.18 PaymentPeriod

Defines when a particular academic fee can be paid.

EduCore supports only two fee types:

* `SEMESTER_FEE`
* `COURSE_REGISTRATION_FEE`

### Fields

* `id`
* `academicSemesterId`
* `type`
* `amount`
* `startDate`
* `deadline`
* `status`
* `createdAt`
* `updatedAt`

### Status

* `UPCOMING`
* `RUNNING`
* `CLOSED`

### Business Rule

When the deadline passes, the PaymentPeriod becomes `CLOSED` and the backend must reject new payment attempts.

Payment history must not be deleted when a payment period closes.

---

## 4.19 Payment

Records an actual student payment.

### Fields

* `id`
* `studentId`
* `paymentPeriodId`
* `amount`
* `transactionId`
* `status`
* `paidAt`
* `createdAt`

### Status

* `PENDING`
* `SUCCESS`
* `FAILED`

### Relationships

* Belongs to one Student.
* Belongs to one PaymentPeriod.

---

## 4.20 Notice

Stores university/departamental announcements.

### Fields

* `id`
* `title`
* `content`
* `publishedBy`
* `publishedAt`
* `expiresAt`
* `createdAt`

### Relationships

* Created/published by a User.

---

# 5. Main Relationships

```text
Department 1 ───────< Program

Program 1 ───────< AcademicSemester

AcademicSemester 1 ───────< AcademicPeriod

AcademicSemester 1 ───────< CourseOffering

Course 1 ───────< CourseOffering

Teacher 1 ───────< CourseOffering

CourseOffering 1 ───────< Enrollment

Student 1 ───────< Enrollment

CourseOffering 1 ───────< Timetable

Timetable 1 ───────< ClassSession

ClassSession 1 ───────< Attendance

Student 1 ───────< Attendance

CourseOffering 1 ───────< Assignment

Assignment 1 ───────< Submission

Student 1 ───────< Submission

Enrollment 1 ─────── 1 Result

AcademicSemester 1 ───────< PaymentPeriod

PaymentPeriod 1 ───────< Payment

Student 1 ───────< Payment
```

### User relationships

```text
User 1 ─────── 1 Student
User 1 ─────── 1 Teacher
```

---

# 6. Important Business Rules

### Academic Structure

1. A Program contains multiple AcademicSemesters.
2. The standard program contains eight academic semesters.
3. AcademicSemester represents Year + Semester rather than Spring/Fall terminology.
4. An AcademicSemester can contain multiple AcademicPeriods.
5. AcademicPeriods can represent classes, two midterms, and final examinations.

### Courses and Classes

6. A Course can be offered in multiple AcademicSemesters.
7. A CourseOffering belongs to exactly one AcademicSemester.
8. A CourseOffering may optionally belong to a Section.
9. Departments that do not use sections can leave the Section relationship empty.
10. A 2-credit course normally has two weekly timetable entries.
11. A 3-credit course normally has three weekly timetable entries.
12. Each scheduled class is approximately one hour.
13. A Timetable represents a recurring schedule.
14. A ClassSession represents an actual class occurrence.
15. A ClassSession can be cancelled without deleting the timetable.

### Enrollment

16. A Student can enroll in multiple CourseOfferings.
17. A CourseOffering can have multiple Students.
18. Enrollment acts as the many-to-many bridge.
19. A Student should not have duplicate active enrollment for the same CourseOffering.

### Attendance

20. Attendance belongs to a specific ClassSession and Student.
21. A student should have at most one attendance record per ClassSession.

### Assignments

22. A CourseOffering can have multiple Assignments.
23. A Student can submit work for an Assignment.
24. A student should have at most one active submission per Assignment unless resubmission is explicitly supported.

### Payments

25. EduCore supports only Semester Fee and Course Registration Fee.
26. Payment periods have a start date and deadline.
27. Payment periods can be Upcoming, Running, or Closed.
28. Payment must be rejected after the deadline.
29. Successful payment records must be retained for historical purposes.
30. Transaction IDs should be unique.

### Authentication

31. User email must be unique.
32. Passwords must never be stored as plain text.
33. Authorization must be based on the user's role.

---

# 7. Data Integrity and Constraints

The implementation should enforce:

* Unique User email
* Unique Student ID
* Unique Teacher employee ID
* Unique Course code
* Unique Department code
* Unique Program code
* Unique Transaction ID
* Valid foreign-key relationships
* Appropriate NOT NULL constraints
* Optional Section relationships
* No duplicate enrollment for the same Student and CourseOffering
* No duplicate attendance for the same Student and ClassSession

Additional constraints will be finalized during Prisma schema implementation.

---

# 8. Indexing Strategy

Indexes should be added to frequently searched fields.

Potential indexes include:

* `User.email`
* `Student.studentId`
* `Teacher.employeeId`
* `Course.code`
* `Department.code`
* `Program.code`
* `Enrollment.studentId`
* `Enrollment.courseOfferingId`
* `Attendance.studentId`
* `Attendance.classSessionId`
* `Payment.studentId`
* `Payment.transactionId`
* `PaymentPeriod.academicSemesterId`

The final indexing strategy will be reviewed after the API requirements are implemented.

---

# 9. Data Lifecycle

Historical academic and financial information should not normally be deleted.

For example:

* Completed enrollments remain stored.
* Attendance records remain stored.
* Results remain stored.
* Successful payments remain stored.
* Closed payment periods remain stored.
* Cancelled class sessions remain stored.

Where appropriate, records should use status fields rather than physical deletion.

---

# 10. Future Considerations

The initial version focuses on the core academic portal.

Future versions may support:

* Multiple universities
* Multiple departments
* More degree programs
* Library management
* Hostel management
* Transportation management
* Advanced notifications
* Online examination
* Analytics dashboards
* Mobile applications

These features are outside the initial 30-day implementation scope.
