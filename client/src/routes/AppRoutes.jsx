import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Departments from "../pages/admin/Departments";
import Programs from "../pages/admin/Programs";
import AcademicSemesters from "../pages/admin/AcademicSemesters";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;