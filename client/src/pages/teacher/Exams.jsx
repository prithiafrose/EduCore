import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    getAllTeacherAssignments,
} from "../../services/teacherAssignmentApi";

import {
    getEnrollments,
} from "../../services/enrollmentApi";

import {
    getAllExams,
} from "../../services/examApi";

import {
    getAllExamMarks,
    createExamMark,
    updateExamMark,
} from "../../services/examMarksApi";

const Exams = () => {
    const [searchParams] = useSearchParams();

    // ========================================
    // STATES
    // ========================================

    const [teacherCourses, setTeacherCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [exams, setExams] = useState([]);
    const [examMarks, setExamMarks] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState(
        searchParams.get("courseOfferingId") || ""
    );

    const [selectedExamId, setSelectedExamId] = useState(
        searchParams.get("examId") || ""
    );

    const [marks, setMarks] = useState({});

    const [loading, setLoading] = useState(true);

    const [savingStudentId, setSavingStudentId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ========================================
    // LOAD TEACHER COURSES
    // ========================================

    const loadTeacherCourses = async () => {
        const response = await getAllTeacherAssignments();

        const data = response?.data || response || [];

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        const teacherAssignments = Array.isArray(data)
            ? data.filter(
                  (assignment) =>
                      Number(assignment.teacher?.userId) ===
                      Number(user?.id)
              )
            : [];

        return teacherAssignments;
    };

    // ========================================
    // LOAD ENROLLMENTS
    // ========================================

    const loadEnrollments = async () => {
        const response = await getEnrollments();

        const data = response?.data || response || [];

        return Array.isArray(data)
            ? data
            : [];
    };

    // ========================================
    // LOAD EXAMS
    // ========================================

    const loadExams = async () => {
        const response = await getAllExams();

        const data = response?.data || response || [];

        return Array.isArray(data)
            ? data
            : [];
    };

    // ========================================
    // LOAD EXAM MARKS
    // ========================================

    const loadExamMarks = async () => {
        const response = await getAllExamMarks();

        const data = response?.data || response || [];

        return Array.isArray(data)
            ? data
            : [];
    };

    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {
        let cancelled = false;

        const loadInitialData = async () => {
            try {
                const [
                    teacherCoursesData,
                    enrollmentsData,
                    examsData,
                    examMarksData,
                ] = await Promise.all([
                    loadTeacherCourses(),
                    loadEnrollments(),
                    loadExams(),
                    loadExamMarks(),
                ]);

                if (cancelled) {
                    return;
                }

                setTeacherCourses(
                    teacherCoursesData
                );

                setEnrollments(
                    enrollmentsData
                );

                setExams(
                    examsData
                );

                setExamMarks(
                    examMarksData
                );

                setLoading(false);
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(err);

                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load exam data."
                );

                setLoading(false);
            }
        };

        loadInitialData();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================
    // EFFECTIVE COURSE
    // ========================================

    const effectiveCourseId =
        selectedCourseId ||
        teacherCourses[0]?.courseOfferingId ||
        teacherCourses[0]?.courseOffering?.id ||
        "";

    // ========================================
    // COURSE CHANGE
    // ========================================

    const handleCourseChange = (e) => {
        const courseId = e.target.value;

        setSelectedCourseId(courseId);
        setSelectedExamId("");
        setMarks({});
        setSuccess("");
        setError("");
    };

    // ========================================
    // EXAM CHANGE
    // ========================================

    const handleExamChange = (e) => {
        const examId = e.target.value;

        setSelectedExamId(examId);
        setMarks({});
        setSuccess("");
        setError("");
    };

    // ========================================
    // FILTER EXAMS BY COURSE
    // ========================================

    const courseExams = exams.filter(
        (exam) =>
            Number(exam.courseOfferingId) ===
            Number(effectiveCourseId)
    );

    // ========================================
    // SELECTED EXAM
    // ========================================

    const selectedExam = exams.find(
        (exam) =>
            Number(exam.id) ===
            Number(selectedExamId)
    );

    // ========================================
    // FILTER STUDENTS BY COURSE
    // ========================================

    const courseEnrollments = enrollments.filter(
        (enrollment) =>
            Number(enrollment.courseOfferingId) ===
            Number(effectiveCourseId)
    );

    // ========================================
    // SELECTED COURSE
    // ========================================

    const selectedCourse = teacherCourses.find(
        (assignment) =>
            Number(
                assignment.courseOfferingId ||
                    assignment.courseOffering?.id
            ) === Number(effectiveCourseId)
    );

    // ========================================
    // COURSE NAME
    // ========================================

    const courseName =
        selectedCourse?.courseOffering?.course?.name ||
        selectedCourse?.courseOffering?.course?.title ||
        selectedCourse?.course?.name ||
        selectedCourse?.course?.title ||
        "Selected Course";

    // ========================================
    // COURSE CODE
    // ========================================

    const courseCode =
        selectedCourse?.courseOffering?.course?.code ||
        selectedCourse?.course?.code ||
        "";

    // ========================================
    // GET EXISTING MARK
    // ========================================

    const getExistingMark = (enrollmentId) => {
        return examMarks.find(
            (mark) =>
                Number(mark.examId) ===
                    Number(selectedExamId) &&
                Number(mark.enrollmentId) ===
                    Number(enrollmentId)
        );
    };

    // ========================================
    // GET STUDENT NAME
    // ========================================

    const getStudentName = (enrollment) => {
        const student = enrollment.student;

        if (!student) {
            return `Student ${enrollment.studentId}`;
        }

        if (student.user?.name) {
            return student.user.name;
        }

        if (student.user?.firstName) {
            return `${student.user.firstName} ${
                student.user.lastName || ""
            }`.trim();
        }

        if (student.name) {
            return student.name;
        }

        if (student.firstName) {
            return `${student.firstName} ${
                student.lastName || ""
            }`.trim();
        }

        return `Student ${enrollment.studentId}`;
    };

    // ========================================
    // GET STUDENT EMAIL
    // ========================================

    const getStudentEmail = (enrollment) => {
        return (
            enrollment.student?.user?.email ||
            enrollment.student?.email ||
            "N/A"
        );
    };

    // ========================================
    // MARK INPUT CHANGE
    // ========================================

    const handleMarkChange = (
        enrollmentId,
        value
    ) => {
        setMarks((previous) => ({
            ...previous,
            [enrollmentId]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ========================================
    // CHECK EXAM LOCK
    // ========================================

    const isExamLocked = () => {
        if (!selectedExam?.date) {
            return false;
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const examDate = new Date(
            selectedExam.date
        );

        examDate.setHours(0, 0, 0, 0);

        return today > examDate;
    };

    // ========================================
    // SAVE / UPDATE MARK
    // ========================================

    const handleSaveMark = async (
        enrollmentId
    ) => {
        try {
            setError("");
            setSuccess("");

            // --------------------------------
            // CHECK EXAM
            // --------------------------------

            if (!selectedExam) {
                setError(
                    "Please select an exam first."
                );

                return;
            }

            // --------------------------------
            // CHECK LOCK
            // --------------------------------

            if (isExamLocked()) {
                setError(
                    "Exam marks are locked because the exam date has passed."
                );

                return;
            }

            // --------------------------------
            // GET ENTERED MARK
            // --------------------------------

            const enteredMark =
                marks[enrollmentId];

            // --------------------------------
            // CHECK EMPTY
            // --------------------------------

            if (
                enteredMark === undefined ||
                enteredMark === ""
            ) {
                setError(
                    "Please enter marks before saving."
                );

                return;
            }

            // --------------------------------
            // CONVERT NUMBER
            // --------------------------------

            const numericMark = Number(
                enteredMark
            );

            // --------------------------------
            // CHECK VALID NUMBER
            // --------------------------------

            if (Number.isNaN(numericMark)) {
                setError(
                    "Marks must be a valid number."
                );

                return;
            }

            // --------------------------------
            // CHECK NEGATIVE
            // --------------------------------

            if (numericMark < 0) {
                setError(
                    "Marks cannot be negative."
                );

                return;
            }

            // --------------------------------
            // MAXIMUM MARKS
            // --------------------------------

            const maxMarks = Number(
                selectedExam.maxMarks
            );

            if (numericMark > maxMarks) {
                setError(
                    `Marks cannot be greater than ${maxMarks}.`
                );

                return;
            }

            // --------------------------------
            // START SAVING
            // --------------------------------

            setSavingStudentId(enrollmentId);

            // --------------------------------
            // CHECK EXISTING MARK
            // --------------------------------

            const existingMark =
                getExistingMark(enrollmentId);

            // --------------------------------
            // UPDATE EXISTING MARK
            // --------------------------------

            if (existingMark) {
                await updateExamMark(
                    existingMark.id,
                    numericMark
                );

                setSuccess(
                    `Exam mark updated successfully for ${getStudentName(
                        courseEnrollments.find(
                            (student) =>
                                Number(student.id) ===
                                Number(enrollmentId)
                        ) || {}
                    )}.`
                );
            }

            // --------------------------------
            // CREATE NEW MARK
            // --------------------------------

            else {
                await createExamMark(
                    selectedExamId,
                    enrollmentId,
                    numericMark
                );

                setSuccess(
                    `Exam mark saved successfully for ${getStudentName(
                        courseEnrollments.find(
                            (student) =>
                                Number(student.id) ===
                                Number(enrollmentId)
                        ) || {}
                    )}.`
                );
            }

            // --------------------------------
            // RELOAD EXAM MARKS
            // --------------------------------

            const updatedMarks =
                await loadExamMarks();

            setExamMarks(
                updatedMarks
            );

            // --------------------------------
            // KEEP SAVED VALUE
            // --------------------------------

            setMarks((previous) => ({
                ...previous,
                [enrollmentId]:
                    numericMark,
            }));
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to save exam mark."
            );
        } finally {
            setSavingStudentId(null);
        }
    };

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(
            date
        ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // ========================================
    // FORMAT TIME
    // ========================================

    const formatTime = (time) => {
        if (!time) {
            return "N/A";
        }

        return new Date(
            time
        ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ========================================
    // LOADING SCREEN
    // ========================================

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <p className="text-gray-500">
                    Loading exams...
                </p>
            </div>
        );
    }

    // ========================================
    // MAIN UI
    // ========================================

    return (
        <>

                {/* HEADER */}

                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">

                    <div>

                        <p className="text-sm font-medium text-indigo-600">
                            Teacher Portal
                        </p>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Exams
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage exam schedules and student marks.
                        </p>

                    </div>

                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm">
                        T
                    </div>

                </header>

                <div className="p-8">

                {/* ERROR */}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg">
                        {success}
                    </div>
                )}

                {/* ========================================
                    COURSE SELECTOR
                ======================================== */}

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Course
                    </label>

                    <select
                        value={effectiveCourseId}
                        onChange={handleCourseChange}
                        className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        {teacherCourses.length === 0 ? (
                            <option value="">
                                No assigned courses
                            </option>
                        ) : (
                            teacherCourses.map(
                                (assignment) => {

                                    const offeringId =
                                        assignment.courseOfferingId ||
                                        assignment.courseOffering?.id;

                                    const course =
                                        assignment.courseOffering?.course ||
                                        assignment.course;

                                    return (
                                        <option
                                            key={offeringId}
                                            value={offeringId}
                                        >
                                            {course?.code ||
                                                "Course"}{" "}
                                            -{" "}
                                            {course?.name ||
                                                course?.title ||
                                                "Unnamed Course"}
                                        </option>
                                    );
                                }
                            )
                        )}

                    </select>

                </div>

                {/* ========================================
                    COURSE INFORMATION
                ======================================== */}

                {effectiveCourseId && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                        <h3 className="text-xl font-bold text-gray-800">
                            {courseCode} {courseName}
                        </h3>

                        <p className="text-gray-500 mt-1">
                            {courseEnrollments.length} enrolled student
                            {courseEnrollments.length !== 1
                                ? "s"
                                : ""}
                        </p>

                    </div>
                )}

                {/* ========================================
                    EXAM SELECTOR
                ======================================== */}

                {effectiveCourseId && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Exam
                        </label>

                        {courseExams.length === 0 ? (

                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                                No exams have been created for this
                                course yet.
                            </div>

                        ) : (

                            <select
                                value={selectedExamId}
                                onChange={handleExamChange}
                                className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select an exam
                                </option>

                                {courseExams.map(
                                    (exam) => (
                                        <option
                                            key={exam.id}
                                            value={exam.id}
                                        >
                                            {exam.type} -{" "}
                                            {formatDate(
                                                exam.date
                                            )}
                                        </option>
                                    )
                                )}

                            </select>

                        )}

                    </div>
                )}

                {/* ========================================
                    EXAM DETAILS
                ======================================== */}

                {selectedExam && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    {selectedExam.type}
                                </h3>

                                <p className="text-gray-500 mt-1">
                                    Exam Information
                                </p>

                            </div>

                            {isExamLocked() ? (

                                <span className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold">
                                    Exam Marks Locked
                                </span>

                            ) : (

                                <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">
                                    Marks Editable
                                </span>

                            )}

                        </div>

                        {/* EXAM INFORMATION */}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

                            <div className="bg-gray-50 rounded-lg p-4">

                                <p className="text-sm text-gray-500">
                                    Date
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {formatDate(
                                        selectedExam.date
                                    )}
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">

                                <p className="text-sm text-gray-500">
                                    Time
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {formatTime(
                                        selectedExam.startTime
                                    )}{" "}
                                    -{" "}
                                    {formatTime(
                                        selectedExam.endTime
                                    )}
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">

                                <p className="text-sm text-gray-500">
                                    Room
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {selectedExam.room ||
                                        "Not assigned"}
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">

                                <p className="text-sm text-gray-500">
                                    Maximum Marks
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {selectedExam.maxMarks}
                                </p>

                            </div>

                        </div>

                        {isExamLocked() && (
                            <div className="mt-5 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">

                                Exam marks are locked because the
                                exam date has passed. Existing marks
                                can only be viewed.

                            </div>
                        )}

                    </div>
                )}

                {/* ========================================
                    STUDENT MARKS
                ======================================== */}

                {selectedExam && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                        {/* TABLE HEADER */}

                        <div className="p-6 border-b">

                            <h3 className="text-xl font-bold text-gray-800">
                                Student Exam Marks
                            </h3>

                            <p className="text-gray-500 mt-1">
                                Enter marks out of{" "}
                                {selectedExam.maxMarks}.
                            </p>

                        </div>

                        {/* NO STUDENTS */}

                        {courseEnrollments.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">
                                No students are enrolled in this
                                course.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                #
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                Student
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                                Email
                                            </th>

                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                                Marks
                                            </th>

                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y">

                                        {courseEnrollments.map(
                                            (
                                                enrollment,
                                                index
                                            ) => {

                                                const existingMark =
                                                    getExistingMark(
                                                        enrollment.id
                                                    );

                                                const currentMark =
                                                    marks[
                                                        enrollment.id
                                                    ] !== undefined
                                                        ? marks[
                                                              enrollment.id
                                                          ]
                                                        : existingMark
                                                        ? existingMark.marks
                                                        : "";

                                                const isSaving =
                                                    Number(
                                                        savingStudentId
                                                    ) ===
                                                    Number(
                                                        enrollment.id
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            enrollment.id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >

                                                        {/* NUMBER */}

                                                        <td className="px-6 py-4 text-gray-600">
                                                            {index + 1}
                                                        </td>

                                                        {/* STUDENT */}

                                                        <td className="px-6 py-4">

                                                            <div className="font-semibold text-gray-800">
                                                                {getStudentName(
                                                                    enrollment
                                                                )}
                                                            </div>

                                                            <div className="text-sm text-gray-500">
                                                                Enrollment ID:{" "}
                                                                {
                                                                    enrollment.id
                                                                }
                                                            </div>

                                                        </td>

                                                        {/* EMAIL */}

                                                        <td className="px-6 py-4 text-gray-600">
                                                            {getStudentEmail(
                                                                enrollment
                                                            )}
                                                        </td>

                                                        {/* MARK INPUT */}

                                                        <td className="px-6 py-4">

                                                            <div className="flex items-center justify-center gap-2">

                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={
                                                                        selectedExam.maxMarks
                                                                    }
                                                                    step="0.01"
                                                                    value={
                                                                        currentMark
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMarkChange(
                                                                            enrollment.id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isExamLocked() ||
                                                                        isSaving
                                                                    }
                                                                    className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                                    placeholder="Enter marks"
                                                                />

                                                                <span className="text-gray-500">
                                                                    /
                                                                    {
                                                                        selectedExam.maxMarks
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>

                                                        {/* SAVE / UPDATE */}

                                                        <td className="px-6 py-4 text-center">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSaveMark(
                                                                        enrollment.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isExamLocked() ||
                                                                    isSaving
                                                                }
                                                                className={`min-w-[90px] px-4 py-2 rounded-lg font-medium transition ${
                                                                    isExamLocked()
                                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                        : existingMark
                                                                        ? "bg-orange-500 text-white hover:bg-orange-600"
                                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                                }`}
                                                            >

                                                                {isSaving
                                                                    ? "Saving..."
                                                                    : existingMark
                                                                    ? "Update"
                                                                    : "Save"}

                                                            </button>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>
                )}

            </div>
        </>

    );
};

export default Exams;