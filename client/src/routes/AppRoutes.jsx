import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";
import AdminDashboard from "../pages/admin/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
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
import AdminProfile from "../pages/admin/Profile";

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
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/programs" element={<Programs />} />
            <Route path="/admin/academic-semesters" element={<AcademicSemesters />} />
            <Route path="/admin/courses" element={<Courses />} />
            <Route path="/admin/course-offerings" element={<CourseOfferings />} />
            <Route path="/admin/sections" element={<AdminSections />} />
            <Route path="/admin/teachers" element={<Teachers />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/enrollments" element={<Enrollments />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/fees" element={<AdminFees />} />
            <Route path="/admin/schedules" element={<AdminSchedules />} />
            <Route path="/admin/class-sessions" element={<AdminClassSessions />} />
            <Route path="/admin/notices" element={<AdminNotices />} />
            <Route path="/admin/change-password" element={<AdminChangePassword />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute allowedRole="TEACHER" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/routine" element={<TeacherRoutine />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/assessments" element={<TeacherAssessments />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route path="/teacher/exams" element={<Exams />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/notices" element={<TeacherNotices />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />
          </Route>
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/routine" element={<ClassRoutine />} />
            <Route path="/student/attendance" element={<Attendance />} />
            <Route path="/student/payments" element={<Payments />} />
            <Route path="/student/course-registration" element={<CourseRegistration />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/transcript" element={<StudentTranscript />} />
            <Route path="/student/notices" element={<StudentNotices />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Routes>
      <AiAssistant />
    </BrowserRouter>
  );
}

export default AppRoutes;