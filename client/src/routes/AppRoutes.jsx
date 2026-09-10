import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";
import AdminDashboard from "../pages/admin/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Departments from "../pages/admin/Departments";
import Programs from "../pages/admin/Programs";
import AcademicSemesters from "../pages/admin/AcademicSemesters";
import Courses from "../pages/admin/Courses";
import CourseOfferings from "../pages/admin/CourseOfferings";
import AdminSections from "../pages/admin/Sections";
import Teachers from "../pages/admin/Teachers";
import Users from "../pages/admin/Users";
import Students from "../pages/admin/Students";
import Enrollments from "../pages/admin/Enrollments";

import TeacherAssessments from "../pages/teacher/Assessments";
import TeacherAttendance from "../pages/teacher/Attendance";
import Exams from "../pages/teacher/Exams";
import TeacherStudents from "../pages/teacher/Students";
import TeacherProfile from "../pages/teacher/Profile";
import TeacherCourses from "../pages/teacher/Courses";
import TeacherRoutine from "../pages/teacher/Routine";
import MyCourses from "../pages/student/MyCourses";
import ClassRoutine from "../pages/student/ClassRoutine";
import Attendance from "../pages/student/Attendance";
import Payments from "../pages/student/Payments";
import StudentResults from "../pages/student/Results";
import StudentProfile from "../pages/student/Profile";
import StudentNotices from "../pages/student/Notices";
import StudentAssignments from "../pages/student/Assignments";
import CourseRegistration from "../pages/student/CourseRegistration";
import TeacherAssignments from "../pages/teacher/Assignments";
import TeacherNotices from "../pages/teacher/Notices";
import StudentTranscript from "../pages/student/Transcript";
import AdminChangePassword from "../pages/admin/ChangePassword";

import AdminResults from "../pages/admin/Results";
import AdminFees from "../pages/admin/Fees";
import AdminSchedules from "../pages/admin/Schedules";
import AdminClassSessions from "../pages/admin/ClassSessions";
import AdminNotices from "../pages/admin/Notices";

import AiAssistant from "../components/AiAssistant";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<Home />} />
<Route path="/home" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
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
  path="/admin/sections"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminSections />
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
<Route
  path="/teacher/attendance"
  element={
    <ProtectedRoute allowedRole="TEACHER">
      <TeacherAttendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/exams"
  element={
    <ProtectedRoute allowedRole="TEACHER">
      <Exams />
    </ProtectedRoute>
  }
/>
<Route
    path="/teacher/students"
    element={
        <ProtectedRoute allowedRole="TEACHER">
            <TeacherStudents />
        </ProtectedRoute>
    }
/>
<Route
    path="/teacher/profile"
    element={
        <ProtectedRoute allowedRole="TEACHER">
            <TeacherProfile />
        </ProtectedRoute>
    }
/>
<Route
    path="/teacher/routine"
    element={
        <ProtectedRoute allowedRole="TEACHER">
            <TeacherRoutine />
        </ProtectedRoute>
    }
/>
<Route
    path="/student/courses"
    element={
        <ProtectedRoute allowedRole="STUDENT">
            <MyCourses />
        </ProtectedRoute>
    }
/>
<Route
    path="/student/routine"
    element={
        <ProtectedRoute allowedRole="STUDENT">
            <ClassRoutine />
        </ProtectedRoute>
    }
/>
<Route
    path="/student/attendance"
    element={
        <ProtectedRoute allowedRole="STUDENT">
            <Attendance />
        </ProtectedRoute>
    }
/>
<Route
  path="/student/payments"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <Payments />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/results"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <StudentResults />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/profile"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <StudentProfile />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/course-registration"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <CourseRegistration />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/notices"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <StudentNotices />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/assignments"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <StudentAssignments />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/assignments"
  element={
    <ProtectedRoute allowedRole="TEACHER">
      <TeacherAssignments />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/notices"
  element={
    <ProtectedRoute allowedRole="TEACHER">
      <TeacherNotices />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/results"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminResults />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/fees"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminFees />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/schedules"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminSchedules />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/class-sessions"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminClassSessions />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/notices"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminNotices />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/change-password"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminChangePassword />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/transcript"
  element={
    <ProtectedRoute allowedRole="STUDENT">
      <StudentTranscript />
    </ProtectedRoute>
  }
/>
      </Routes>
      <AiAssistant />
    </BrowserRouter>
  );
}

export default AppRoutes;