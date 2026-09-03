import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Departments from "../pages/admin/Departments";
import Programs from "../pages/admin/Programs";
import AcademicSemesters from "../pages/admin/AcademicSemesters";
import Courses from "../pages/admin/Courses";
import CourseOfferings from "../pages/admin/CourseOfferings";
import Teachers from "../pages/admin/Teachers";
import Users from "../pages/admin/Users";
import Students from "../pages/admin/Students";
import Enrollments from "../pages/admin/Enrollments";
import Assessments from "../pages/admin/Assessments";
import TeacherAssessments from "../pages/teacher/Assessments";
import TeacherCourses from "../pages/teacher/Courses";function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<Home />} />
<Route path="/home" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route
  path="/register"
  element={<Register />}
/>

        {/* Dashboards */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/departments"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Departments />
    </ProtectedRoute>
  }
/>
<Route
          path="/admin/programs"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Programs />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/academic-semesters"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AcademicSemesters />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/courses"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Courses />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/course-offerings"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <CourseOfferings />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/teachers"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Teachers />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Users />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/students"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Students />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/enrollments"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Enrollments />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/assessments"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <Assessments />
    </ProtectedRoute>
  }
/>
<Route
    path="/teacher/courses"
    element={
        <ProtectedRoute allowedRole="TEACHER">
            <TeacherCourses />
        </ProtectedRoute>
    }
/>
<Route
  path="/teacher/assessments"
  element={
    <ProtectedRoute allowedRole="TEACHER">
      <TeacherAssessments />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;