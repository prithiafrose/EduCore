
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  getAllTeacherAssignments,
} from "../../services/teacherAssignmentApi";

import {
  getAssessmentsByCourseOffering,
} from "../../services/assessmentApi";

import {
  getActivitiesByAssessment,
} from "../../services/assessmentActivityApi";

import {
  getEnrollments,
} from "../../services/enrollmentApi";

import {
  getMarksByActivity,
  createStudentMark,
  updateStudentMark,
} from "../../services/studentMarkApi";

const Assessments = () => {
  const [searchParams] = useSearchParams();

  const courseOfferingId =
    searchParams.get("courseOfferingId");

  const [assignments, setAssignments] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const [activities, setActivities] = useState({});

  const [enrollments, setEnrollments] = useState([]);

  const [activityMarks, setActivityMarks] =
    useState({});

  const [selectedActivity, setSelectedActivity] =
    useState(null);

  const [marksInput, setMarksInput] =
    useState({});

  const [savingMark, setSavingMark] =
    useState({});

  const [loadingMarks, setLoadingMarks] =
    useState(false);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingAssessments, setLoadingAssessments] =
    useState(false);

  const [loadingActivities, setLoadingActivities] =
    useState({});

  const [error, setError] = useState("");

  const [marksError, setMarksError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // ========================================
  // ALL MARKS STATE
  // ========================================

  const [showAllMarks, setShowAllMarks] =
    useState(false);

  const [courseAssessmentMarks, setCourseAssessmentMarks] =
    useState({});

  const [loadingAllMarks, setLoadingAllMarks] =
    useState(false);

  const [allMarksError, setAllMarksError] =
    useState("");

  // --------------------------------
  // Load Teacher Courses
  // --------------------------------
  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        setLoadingCourses(true);
        setError("");

        const response =
          await getAllTeacherAssignments();

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user) {
          setError(
            "Teacher information not found."
          );
          return;
        }

        const teacherAssignments =
          Array.isArray(response)
            ? response.filter(
                (assignment) =>
                  Number(
                    assignment.teacher?.userId
                  ) === Number(user.id)
              )
            : [];

        setAssignments(teacherAssignments);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load your courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  // --------------------------------
  // Load Enrollments
  // --------------------------------
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await getEnrollments();

        const enrollmentData =
          Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

        setEnrollments(enrollmentData);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load students."
        );
      }
    };

    fetchEnrollments();
  }, []);

  // --------------------------------
  // Find Selected Course
  // --------------------------------
  const selectedAssignment =
    assignments.find(
      (assignment) =>
        Number(
          assignment.courseOfferingId
        ) === Number(courseOfferingId)
    );

  // --------------------------------
  // Load Assessments
  // --------------------------------
  useEffect(() => {
    if (!courseOfferingId) {
      setAssessments([]);
      return;
    }

    const fetchAssessments = async () => {
      try {
        setLoadingAssessments(true);
        setError("");

        const response =
          await getAssessmentsByCourseOffering(
            courseOfferingId
          );

        setAssessments(
          Array.isArray(response?.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load assessments."
        );
      } finally {
        setLoadingAssessments(false);
      }
    };

    fetchAssessments();
  }, [courseOfferingId]);

  // --------------------------------
  // Load Activities
  // --------------------------------
  const loadActivities = async (
    assessmentId
  ) => {
    try {
      setLoadingActivities((prev) => ({
        ...prev,
        [assessmentId]: true,
      }));

      const response =
        await getActivitiesByAssessment(
          assessmentId
        );

      setActivities((prev) => ({
        ...prev,
        [assessmentId]: Array.isArray(
          response?.data
        )
          ? response.data
          : [],
      }));
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load assessment activities."
      );
    } finally {
      setLoadingActivities((prev) => ({
        ...prev,
        [assessmentId]: false,
      }));
    }
  };

  // ========================================
  // LOAD ALL ASSESSMENT MARKS
  // ========================================
  const loadAllAssessmentMarks = async () => {
    try {
      setLoadingAllMarks(true);
      setAllMarksError("");

      const nonAttendanceAssessments =
        assessments.filter(
          (assessment) =>
            assessment.type !== "ATTENDANCE"
        );

      const assessmentResults =
        await Promise.all(
          nonAttendanceAssessments.map(
            async (assessment) => {
              const response =
                await getActivitiesByAssessment(
                  assessment.id
                );

              const assessmentActivities =
                Array.isArray(response?.data)
                  ? response.data
                  : [];

              return {
                assessment,
                activities:
                  assessmentActivities,
              };
            }
          )
        );

      const marksMap = {};

      assessmentResults.forEach(
        ({
          assessment,
          activities: assessmentActivities,
        }) => {
          marksMap[assessment.id] = {
            assessment,
            activities:
              assessmentActivities,
          };
        }
      );

      setCourseAssessmentMarks(marksMap);
      setShowAllMarks(true);
    } catch (error) {
      console.error(error);

      setAllMarksError(
        error.response?.data?.message ||
          "Failed to load all assessment marks."
      );
    } finally {
      setLoadingAllMarks(false);
    }
  };

  // --------------------------------
  // Close All Marks
  // --------------------------------
  const handleCloseAllMarks = () => {
    setShowAllMarks(false);
    setAllMarksError("");
  };

  // --------------------------------
  // Load Marks By Activity
  // --------------------------------
  const loadActivityMarks = async (
    activityId
  ) => {
    try {
      setLoadingMarks(true);
      setMarksError("");

      const response =
        await getMarksByActivity(activityId);

      const marks = Array.isArray(response?.data)
        ? response.data
        : [];

      setActivityMarks((prev) => ({
        ...prev,
        [activityId]: marks,
      }));

      const inputValues = {};

      marks.forEach((mark) => {
        inputValues[mark.enrollmentId] =
          mark.marks;
      });

      setMarksInput((prev) => ({
        ...prev,
        [activityId]: inputValues,
      }));
    } catch (error) {
      console.error(error);

      setMarksError(
        error.response?.data?.message ||
          "Failed to load student marks."
      );
    } finally {
      setLoadingMarks(false);
    }
  };

  // --------------------------------
  // Enter Marks
  // --------------------------------
  const handleEnterMarks = async (
    activity
  ) => {
    setSelectedActivity(activity);
    setMarksError("");
    setSuccessMessage("");

    await loadActivityMarks(activity.id);
  };

  // --------------------------------
  // View Marks
  // --------------------------------
  const handleViewMarks = async (
    activity
  ) => {
    setSelectedActivity(activity);
    setMarksError("");
    setSuccessMessage("");

    await loadActivityMarks(activity.id);
  };

  // --------------------------------
  // Back To Activities
  // --------------------------------
  const handleBackToActivities = () => {
    setSelectedActivity(null);
    setMarksError("");
    setSuccessMessage("");
  };

  // --------------------------------
  // Handle Marks Input
  // --------------------------------
  const handleMarksChange = (
    enrollmentId,
    value
  ) => {
    setMarksInput((prev) => ({
      ...prev,
      [selectedActivity.id]: {
        ...(prev[selectedActivity.id] || {}),
        [enrollmentId]: value,
      },
    }));

    setMarksError("");
    setSuccessMessage("");
  };

  // --------------------------------
  // Save / Update Mark
  // --------------------------------
  const handleSaveMark = async (
    enrollmentId
  ) => {
    if (!selectedActivity) {
      return;
    }

    const activityId =
      selectedActivity.id;

    const value =
      marksInput[activityId]?.[enrollmentId];

    if (
      value === undefined ||
      value === ""
    ) {
      setMarksError(
        "Please enter marks before saving."
      );
      return;
    }

    const marks = Number(value);

    if (Number.isNaN(marks)) {
      setMarksError(
        "Marks must be a valid number."
      );
      return;
    }

    if (marks < 0) {
      setMarksError(
        "Marks cannot be negative."
      );
      return;
    }

    if (
      marks >
      Number(selectedActivity.maxMarks)
    ) {
      setMarksError(
        `Marks cannot be greater than ${selectedActivity.maxMarks}.`
      );
      return;
    }

    setSavingMark((prev) => ({
      ...prev,
      [enrollmentId]: true,
    }));

    setMarksError("");
    setSuccessMessage("");

    try {
      const existingMarks =
        activityMarks[activityId] || [];

      const existingMark =
        existingMarks.find(
          (mark) =>
            Number(mark.enrollmentId) ===
            Number(enrollmentId)
        );

      if (existingMark) {
        const response =
          await updateStudentMark(
            existingMark.id,
            marks
          );

        setActivityMarks((prev) => ({
          ...prev,
          [activityId]: (
            prev[activityId] || []
          ).map((mark) =>
            mark.id === existingMark.id
              ? {
                  ...mark,
                  marks:
                    response?.data?.marks ??
                    marks,
                }
              : mark
          ),
        }));

        setSuccessMessage(
          "Student mark updated successfully."
        );
      } else {
        const response =
          await createStudentMark(
            enrollmentId,
            activityId,
            marks
          );

        const newMark = response?.data;

        setActivityMarks((prev) => ({
          ...prev,
          [activityId]: [
            ...(prev[activityId] || []),
            newMark,
          ],
        }));

        setSuccessMessage(
          "Student mark saved successfully."
        );
      }

      // Refresh the complete marks table
      if (showAllMarks) {
        await loadAllAssessmentMarks();
      }
    } catch (error) {
      console.error(error);

      setMarksError(
        error.response?.data?.message ||
          "Failed to save student mark."
      );
    } finally {
      setSavingMark((prev) => ({
        ...prev,
        [enrollmentId]: false,
      }));
    }
  };

  // --------------------------------
  // Students For Selected Course
  // --------------------------------
  const courseEnrollments =
    enrollments.filter(
      (enrollment) =>
        Number(
          enrollment.courseOfferingId
        ) === Number(courseOfferingId)
    );

  // ========================================
  // CALCULATE STUDENT ASSESSMENT MARK
  // ========================================
  const getStudentAssessmentMark = (
    assessmentId,
    enrollmentId
  ) => {
    const assessmentData =
      courseAssessmentMarks[assessmentId];

    if (!assessmentData) {
      return null;
    }

    const assessmentActivities =
      assessmentData.activities || [];

    let total = 0;
    let enteredCount = 0;

    assessmentActivities.forEach(
      (activity) => {
        const activityMark =
          (activity.marks || []).find(
            (mark) =>
              Number(mark.enrollmentId) ===
              Number(enrollmentId)
          );

        if (activityMark) {
          total += Number(activityMark.marks);
          enteredCount += 1;
        }
      }
    );

    if (enteredCount === 0) {
      return null;
    }

    return total;
  };

  // ========================================
  // GET ASSESSMENT DISPLAY LABEL
  // ========================================
  const getAssessmentLabel = (
    assessment
  ) => {
    if (assessment.type === "MIDTERM") {
      return "Midterm";
    }

    if (assessment.type === "EVALUATION") {
      return "Evaluation";
    }

    if (assessment.type === "ATTENDANCE") {
      return "Attendance";
    }

    return assessment.name;
  };

  // ========================================
  // GET ASSESSMENT TOTAL
  // ========================================
  const getStudentTotalAssessmentMark = (
    enrollmentId
  ) => {
    let total = 0;
    let hasAnyMark = false;

    assessments.forEach((assessment) => {
      if (assessment.type === "ATTENDANCE") {
        return;
      }

      const mark =
        getStudentAssessmentMark(
          assessment.id,
          enrollmentId
        );

      if (mark !== null) {
        total += mark;
        hasAnyMark = true;
      }
    });

    if (!hasAnyMark) {
      return null;
    }

    return total;
  };

  // --------------------------------
  // Sidebar
  // --------------------------------
  const navigation = [
    {
      title: "Teaching",
      items: [
        {
          name: "Dashboard",
          path: "/teacher",
        },
        {
          name: "My Courses",
          path: "/teacher/courses",
        },
        {
          name: "Class Routine",
          path: "/teacher/routine",
        },
        {
          name: "Attendance",
          path: "/teacher/attendance",
        },
      ],
    },
    {
      title: "Academic",
      items: [
        {
          name: "Assessments",
          path: "/teacher/assessments",
        },
        {
          name: "Exams",
          path: "/teacher/exams",
        },
        {
          name: "Students",
          path: "/teacher/students",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          name: "Profile",
          path: "/teacher/profile",
        },
        {
          name: "Logout",
          path: "/login",
        },
      ],
    },
  ];

  // ========================================
  // COURSE LIST VIEW
  // ========================================
  const renderCourseList = () => {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Assessments
          </h1>

          <p className="mt-2 text-gray-500">
            Manage assessments and student marks
            for your assigned courses.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {!loadingCourses && !error && (
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Assigned Courses
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                {assignments.length}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Courses available
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Assessment Types
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                3
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Attendance, Midterm & Evaluation
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Assessment Marks
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                40
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Total assessment component
              </p>
            </div>

          </div>
        )}

        <div className="rounded-xl bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-6 py-5">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                My Courses
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a course to manage its
                assessments.
              </p>
            </div>

            {!loadingCourses && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                {assignments.length} Courses
              </span>
            )}

          </div>

          {loadingCourses && (
            <div className="p-10 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

              <p className="text-sm text-gray-500">
                Loading your courses...
              </p>

            </div>
          )}

          {!loadingCourses &&
            !error &&
            assignments.length === 0 && (
              <div className="p-10 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  📚
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No Courses Assigned
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  You currently don't have any
                  assigned courses.
                </p>

              </div>
            )}

          {!loadingCourses &&
            assignments.length > 0 && (
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">

                {assignments.map(
                  (assignment) => {
                    const course =
                      assignment.courseOffering
                        ?.course;

                    const semester =
                      assignment.courseOffering
                        ?.academicSemester;

                    const section =
                      assignment.section;

                    return (
                      <div
                        key={assignment.id}
                        className="rounded-xl border border-gray-200 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                      >

                        <div className="flex items-start justify-between">

                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-lg font-bold text-indigo-600">
                            {course?.code?.substring(
                              0,
                              2
                            ) || "CR"}
                          </div>

                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                            Assigned
                          </span>

                        </div>

                        <div className="mt-5">

                          <p className="text-sm font-semibold text-indigo-600">
                            {course?.code ||
                              "Course Code"}
                          </p>

                          <h3 className="mt-1 text-lg font-semibold text-gray-800">
                            {course?.name ||
                              "Course Name"}
                          </h3>

                        </div>

                        <div className="mt-5 space-y-2.5 border-t pt-4">

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Semester
                            </span>

                            <span className="font-medium text-gray-700">
                              {semester?.name ||
                                "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Section
                            </span>

                            <span className="font-medium text-gray-700">
                              {section?.name ||
                                "All Sections"}
                            </span>
                          </div>

                        </div>

                        <div className="mt-5">

                          <Link
                            to={`/teacher/assessments?courseOfferingId=${assignment.courseOfferingId}`}
                            className="block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700"
                          >
                            Manage Assessments
                          </Link>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </div>
      </>
    );
  };

  // ========================================
  // STUDENT MARKS VIEW
  // ========================================
  const renderStudentMarks = () => {
    const activityId =
      selectedActivity?.id;

    const marks =
      activityMarks[activityId] || [];

    return (
      <>
        <div className="mb-6">

          <button
            type="button"
            onClick={handleBackToActivities}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Activities
          </button>

        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-semibold text-indigo-600">
                Student Marks
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-800">
                {selectedActivity?.name}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                View and manage marks for each
                enrolled student.
              </p>

            </div>

            <div className="rounded-lg bg-indigo-50 px-6 py-4 text-center">

              <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                Maximum Marks
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-700">
                {selectedActivity?.maxMarks}
              </p>

            </div>

          </div>

        </div>

        {marksError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {marksError}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-green-700">
            {successMessage}
          </div>
        )}

        {!loadingMarks && (
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Total Students
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-800">
                {courseEnrollments.length}
              </p>

            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Marks Entered
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {marks.length}
              </p>

            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Marks Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-500">
                {Math.max(
                  courseEnrollments.length -
                    marks.length,
                  0
                )}
              </p>

            </div>

          </div>
        )}

        <div className="rounded-xl bg-white shadow-sm">

          <div className="border-b px-6 py-5">

            <h2 className="text-xl font-semibold text-gray-800">
              Student Marks
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All students enrolled in this course
              are listed below.
            </p>

          </div>

          {loadingMarks && (
            <div className="p-10 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

              <p className="text-sm text-gray-500">
                Loading student marks...
              </p>

            </div>
          )}

          {!loadingMarks &&
            courseEnrollments.length === 0 && (
              <div className="p-10 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  👨‍🎓
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No Students Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  No students are enrolled in this
                  course.
                </p>

              </div>
            )}

          {!loadingMarks &&
            courseEnrollments.length > 0 && (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 text-left">

                    <tr className="border-b">

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Student ID
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Student Name
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Email
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Marks
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {courseEnrollments.map(
                      (enrollment) => {

                        const existingMark =
                          marks.find(
                            (mark) =>
                              Number(
                                mark.enrollmentId
                              ) ===
                              Number(
                                enrollment.id
                              )
                          );

                        const currentValue =
                          marksInput[
                            activityId
                          ]?.[
                            enrollment.id
                          ] ?? "";

                        const isSaving =
                          savingMark[
                            enrollment.id
                          ];

                        return (
                          <tr
                            key={
                              enrollment.id
                            }
                            className="hover:bg-gray-50"
                          >

                            <td className="px-6 py-4">

                              <span className="font-medium text-indigo-600">
                                {enrollment.student
                                  ?.studentId ||
                                  "N/A"}
                              </span>

                            </td>

                            <td className="px-6 py-4">

                              <p className="font-medium text-gray-800">
                                {enrollment.student
                                  ?.name ||
                                  "Unknown Student"}
                              </p>

                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500">
                              {enrollment.student
                                ?.email ||
                                "N/A"}
                            </td>

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-2">

                                <input
                                  type="number"
                                  min="0"
                                  max={
                                    selectedActivity?.maxMarks
                                  }
                                  step="0.01"
                                  value={
                                    currentValue
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleMarksChange(
                                      enrollment.id,
                                      event.target
                                        .value
                                    )
                                  }
                                  className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                  placeholder="Marks"
                                />

                                <span className="text-sm text-gray-400">
                                  /
                                  {
                                    selectedActivity?.maxMarks
                                  }
                                </span>

                              </div>

                            </td>

                            <td className="px-6 py-4">

                              {existingMark ? (
                                <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                  Entered
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                                  Not Entered
                                </span>
                              )}

                            </td>

                            <td className="px-6 py-4">

                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() =>
                                  handleSaveMark(
                                    enrollment.id
                                  )
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                                  isSaving
                                    ? "cursor-not-allowed bg-gray-400"
                                    : "bg-indigo-600 hover:bg-indigo-700"
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
      </>
    );
  };

  // ========================================
  // ALL MARKS TABLE
  // ========================================
  const renderAllMarks = () => {
    const attendanceAssessment =
      assessments.find(
        (assessment) =>
          assessment.type === "ATTENDANCE"
      );

    const nonAttendanceAssessments =
      assessments.filter(
        (assessment) =>
          assessment.type !== "ATTENDANCE"
      );

    return (
      <>
        <div className="mb-6">

          <button
            type="button"
            onClick={handleCloseAllMarks}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Assessments
          </button>

        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-semibold text-indigo-600">
                Assessment Marks
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-800">
                {selectedAssignment?.courseOffering?.course?.code ||
                  "Course"}{" "}
                — All Students
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Complete assessment marks for all
                students enrolled in this course.
              </p>

            </div>

            <div className="rounded-lg bg-indigo-50 px-6 py-4 text-center">

              <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                Assessment Component
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-700">
                40
              </p>

              <p className="text-xs text-indigo-600">
                marks
              </p>

            </div>

          </div>

        </div>

        {allMarksError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {allMarksError}
          </div>
        )}

        {loadingAllMarks ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

            <p className="text-sm text-gray-500">
              Loading all assessment marks...
            </p>

          </div>
        ) : courseEnrollments.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              👨‍🎓
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              No Students Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              No students are enrolled in this
              course.
            </p>

          </div>
        ) : (
          <div className="rounded-xl bg-white shadow-sm">

            <div className="border-b px-6 py-5">

              <h2 className="text-xl font-semibold text-gray-800">
                Course Assessment Marks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Marks are automatically calculated
                from individual assessment activities.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 text-left">

                  <tr className="border-b">

                    <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-700">
                      Student ID
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-700">
                      Student
                    </th>

                    {attendanceAssessment && (
                      <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-700">
                        Attendance /10
                      </th>
                    )}

                    {nonAttendanceAssessments.map(
                      (assessment) => (
                        <th
                          key={assessment.id}
                          className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-700"
                        >
                          {getAssessmentLabel(
                            assessment
                          )}{" "}
                          /
                          {
                            assessment.maxMarks
                          }
                        </th>
                      )
                    )}

                    <th className="whitespace-nowrap bg-indigo-50 px-5 py-4 text-sm font-bold text-indigo-700">
                      Total /40
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {courseEnrollments.map(
                    (enrollment) => {

                      let total = 0;
                      let hasAnyMark = false;

                      return (
                        <tr
                          key={enrollment.id}
                          className="hover:bg-gray-50"
                        >

                          <td className="whitespace-nowrap px-5 py-4">

                            <span className="font-medium text-indigo-600">
                              {enrollment.student
                                ?.studentId ||
                                "N/A"}
                            </span>

                          </td>

                          <td className="whitespace-nowrap px-5 py-4">

                            <div>

                              <p className="font-medium text-gray-800">
                                {enrollment.student
                                  ?.name ||
                                  "Unknown Student"}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {enrollment.student
                                  ?.email ||
                                  "N/A"}
                              </p>

                            </div>

                          </td>

                          {attendanceAssessment && (
                            <td className="whitespace-nowrap px-5 py-4">

                              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                Automatic
                              </span>

                            </td>
                          )}

                          {nonAttendanceAssessments.map(
                            (assessment) => {

                              const mark =
                                getStudentAssessmentMark(
                                  assessment.id,
                                  enrollment.id
                                );

                              if (
                                mark !== null
                              ) {
                                total += mark;
                                hasAnyMark =
                                  true;
                              }

                              return (
                                <td
                                  key={
                                    assessment.id
                                  }
                                  className="whitespace-nowrap px-5 py-4"
                                >
                                  {mark !== null ? (
                                    <span className="font-medium text-gray-800">
                                      {mark}
                                      <span className="text-gray-400">
                                        /
                                        {
                                          assessment.maxMarks
                                        }
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">
                                      —
                                    </span>
                                  )}
                                </td>
                              );
                            }
                          )}

                          <td className="whitespace-nowrap bg-indigo-50 px-5 py-4">

                            {hasAnyMark ? (
                              <span className="font-bold text-indigo-700">
                                {total.toFixed(
                                  2
                                )}
                                <span className="font-medium text-indigo-400">
                                  /40
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                —
                              </span>
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            <div className="border-t bg-gray-50 px-6 py-4">

              <div className="flex flex-wrap items-center gap-4 text-sm">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  <span className="text-gray-600">
                    Automatic attendance
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    —
                  </span>
                  <span className="text-gray-600">
                    Marks not entered
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}
      </>
    );
  };

  // ========================================
  // SELECTED COURSE VIEW
  // ========================================
  const renderAssessmentManagement = () => {
    const course =
      selectedAssignment?.courseOffering?.course;

    const semester =
      selectedAssignment?.courseOffering
        ?.academicSemester;

    const section =
      selectedAssignment?.section;

    if (showAllMarks) {
      return renderAllMarks();
    }

    return (
      <>
        {selectedActivity
          ? renderStudentMarks()
          : (
              <>
                <div className="mb-6">

                  <Link
                    to="/teacher/assessments"
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    ← Back to Courses
                  </Link>

                </div>

                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                        {course?.code?.substring(
                          0,
                          2
                        ) || "CR"}
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-indigo-600">
                          {course?.code ||
                            "Course Code"}
                        </p>

                        <h1 className="text-2xl font-bold text-gray-800">
                          {course?.name ||
                            "Course Name"}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                          {semester?.name || "N/A"}
                          {" • "}
                          {section?.name ||
                            "All Sections"}
                        </p>

                      </div>

                    </div>

                    <div className="rounded-lg bg-gray-50 px-5 py-3 text-center">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Assessment Component
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        40
                      </p>

                      <p className="text-xs text-gray-500">
                        marks
                      </p>

                    </div>

                  </div>

                </div>

                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                    {error}
                  </div>
                )}

                <div className="rounded-xl bg-white shadow-sm">

                  <div className="flex flex-col gap-4 border-b px-6 py-5 md:flex-row md:items-center md:justify-between">

                    <div>

                      <h2 className="text-xl font-semibold text-gray-800">
                        Assessments
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        View assessment structures and
                        manage student marks.
                      </p>

                    </div>

                    {!loadingAssessments &&
                      assessments.length > 0 && (
                        <button
                          type="button"
                          onClick={
                            loadAllAssessmentMarks
                          }
                          disabled={
                            loadingAllMarks
                          }
                          className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white ${
                            loadingAllMarks
                              ? "cursor-not-allowed bg-gray-400"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                        >
                          {loadingAllMarks
                            ? "Loading Marks..."
                            : "View All Marks"}
                        </button>
                      )}

                  </div>

                  {loadingAssessments && (
                    <div className="p-10 text-center">

                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

                      <p className="text-sm text-gray-500">
                        Loading assessments...
                      </p>

                    </div>
                  )}

                  {!loadingAssessments &&
                    assessments.length === 0 && (
                      <div className="p-10 text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                          📝
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800">
                          No Assessments Found
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          No assessments have been
                          created for this course yet.
                        </p>

                      </div>
                    )}

                  {!loadingAssessments &&
                    assessments.length > 0 && (
                      <div className="space-y-5 p-6">

                        {assessments.map(
                          (assessment) => {

                            const assessmentActivities =
                              activities[
                                assessment.id
                              ] || [];

                            const isLoading =
                              loadingActivities[
                                assessment.id
                              ];

                            return (
                              <div
                                key={
                                  assessment.id
                                }
                                className="rounded-xl border border-gray-200"
                              >

                                <div className="flex flex-col gap-4 border-b bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">

                                  <div>

                                    <div className="flex items-center gap-3">

                                      <h3 className="text-lg font-semibold text-gray-800">
                                        {
                                          assessment.name
                                        }
                                      </h3>

                                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                        {
                                          assessment.type
                                        }
                                      </span>

                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                      Maximum Marks:{" "}
                                      <span className="font-medium text-gray-700">
                                        {
                                          assessment.maxMarks
                                        }
                                      </span>
                                    </p>

                                  </div>

                                  {assessment.type ===
                                  "ATTENDANCE" ? (
                                    <span className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                                      Automatic
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        loadActivities(
                                          assessment.id
                                        )
                                      }
                                      className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                      {isLoading
                                        ? "Loading..."
                                        : "View Activities"}
                                    </button>
                                  )}

                                </div>

                                {assessment.type ===
                                  "ATTENDANCE" && (
                                  <div className="p-5">

                                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4">

                                      <p className="font-medium text-green-800">
                                        Attendance marks are
                                        calculated automatically.
                                      </p>

                                      <p className="mt-1 text-sm text-green-700">
                                        Teachers do not enter
                                        attendance marks here.
                                      </p>

                                    </div>

                                  </div>
                                )}

                                {assessment.type !==
                                  "ATTENDANCE" &&
                                  assessmentActivities.length >
                                    0 && (
                                    <div className="p-5">

                                      <div className="mb-4 flex items-center justify-between">

                                        <h4 className="font-semibold text-gray-800">
                                          Activities
                                        </h4>

                                        <span className="text-sm text-gray-500">
                                          {
                                            assessmentActivities.length
                                          }{" "}
                                          activities
                                        </span>

                                      </div>

                                      <div className="overflow-x-auto">

                                        <table className="w-full">

                                          <thead className="bg-gray-50 text-left">

                                            <tr className="border-b">

                                              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                Activity
                                              </th>

                                              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                Maximum Marks
                                              </th>

                                              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                Date
                                              </th>

                                              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                Action
                                              </th>

                                            </tr>

                                          </thead>

                                          <tbody className="divide-y divide-gray-200">

                                            {assessmentActivities.map(
                                              (activity) => (
                                                <tr
                                                  key={
                                                    activity.id
                                                  }
                                                  className="hover:bg-gray-50"
                                                >

                                                  <td className="px-4 py-4 font-medium text-gray-800">
                                                    {
                                                      activity.name
                                                    }
                                                  </td>

                                                  <td className="px-4 py-4 text-sm text-gray-700">
                                                    {
                                                      activity.maxMarks
                                                    }
                                                  </td>

                                                  <td className="px-4 py-4 text-sm text-gray-500">
                                                    {activity.activityDate
                                                      ? new Date(
                                                          activity.activityDate
                                                        ).toLocaleDateString()
                                                      : "Not set"}
                                                  </td>

                                                  <td className="px-4 py-4">

                                                    <div className="flex flex-wrap gap-2">

                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          handleViewMarks(
                                                            activity
                                                          )
                                                        }
                                                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                                                      >
                                                        View Marks
                                                      </button>

                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          handleEnterMarks(
                                                            activity
                                                          )
                                                        }
                                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                                      >
                                                        Enter Marks
                                                      </button>

                                                    </div>

                                                  </td>

                                                </tr>
                                              )
                                            )}

                                          </tbody>

                                        </table>

                                      </div>

                                    </div>
                                  )}

                                {assessment.type !==
                                  "ATTENDANCE" &&
                                  !isLoading &&
                                  assessmentActivities.length ===
                                    0 &&
                                  activities[
                                    assessment.id
                                  ] && (
                                    <div className="p-5">

                                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-yellow-700">
                                        No activities have been
                                        created for this
                                        assessment yet.
                                      </div>

                                    </div>
                                  )}

                              </div>
                            );
                          }
                        )}

                      </div>
                    )}

                </div>
              </>
            )}

      </>
    );
  };

  // ========================================
  // MAIN RETURN
  // ========================================
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white">

        <div className="border-b border-slate-700 px-6 py-5">

          <h1 className="text-2xl font-bold">
            EduCore
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Teacher Portal
          </p>

        </div>

        <nav className="px-4 py-6">

          {navigation.map((section) => (
            <div
              key={section.title}
              className="mb-7"
            >

              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>

              <div className="space-y-1">

                {section.items.map((item) => {

                  const isActive =
                    item.path ===
                    "/teacher/assessments";

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}

              </div>

            </div>
          ))}

        </nav>

      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">

        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">

          <div>

            <p className="text-sm text-gray-500">
              Teacher Portal
            </p>

            <h2 className="text-lg font-semibold text-gray-800">
              Assessment Management
            </h2>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-medium text-gray-800">
                Teacher
              </p>

              <p className="text-xs text-gray-500">
                Academic Staff
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              T
            </div>

          </div>

        </header>

        {/* Content */}
        <main className="flex-1 p-8">

          {courseOfferingId
            ? renderAssessmentManagement()
            : renderCourseList()}

        </main>

      </div>

    </div>
  );
};

export default Assessments;

