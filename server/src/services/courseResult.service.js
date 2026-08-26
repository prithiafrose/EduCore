const prisma = require("../config/prisma");

// ------------------------------------
// Calculate Grade
// ------------------------------------

const calculateGrade = (totalMarks) => {
  const marks = Number(totalMarks);

  if (marks >= 80) {
    return {
      grade: "A_PLUS",
      gradePoint: 4.0,
    };
  }

  if (marks >= 75) {
    return {
      grade: "A",
      gradePoint: 3.75,
    };
  }

  if (marks >= 70) {
    return {
      grade: "A_MINUS",
      gradePoint: 3.5,
    };
  }

  if (marks >= 65) {
    return {
      grade: "B_PLUS",
      gradePoint: 3.25,
    };
  }

  if (marks >= 60) {
    return {
      grade: "B",
      gradePoint: 3.0,
    };
  }

  if (marks >= 55) {
    return {
      grade: "B_MINUS",
      gradePoint: 2.75,
    };
  }

  if (marks >= 50) {
    return {
      grade: "C_PLUS",
      gradePoint: 2.5,
    };
  }

  if (marks >= 45) {
    return {
      grade: "C",
      gradePoint: 2.25,
    };
  }

  if (marks >= 40) {
    return {
      grade: "D",
      gradePoint: 2.0,
    };
  }

  return {
    grade: "F",
    gradePoint: 0.0,
  };
};


// ------------------------------------
// Generate Course Result
// ------------------------------------

const generateCourseResult = async (enrollmentId) => {
  const id = Number(enrollmentId);

  // ------------------------------------
  // 1. Check Enrollment
  // ------------------------------------

  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        id,
      },
    });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const courseOfferingId =
    enrollment.courseOfferingId;

  const studentId =
    enrollment.studentId;


  // ====================================
  // 2. CALCULATE ATTENDANCE → /10
  // ====================================

  const attendanceRecords =
    await prisma.attendance.findMany({
      where: {
        studentId,

        classSession: {
          courseOfferingId,

          // Cancelled classes are ignored
          status: {
            not: "CANCELLED",
          },
        },
      },
    });

  const totalClasses =
    attendanceRecords.length;

 const attendedClasses =
  attendanceRecords.filter(
    (attendance) =>
      attendance.status === "PRESENT" ||
      attendance.status === "LATE"
  ).length;

  let attendanceResult = 0;

 if (totalClasses > 0) {
  attendanceResult =
    (attendedClasses / totalClasses) * 10;
}

  attendanceResult =
    Number(attendanceResult.toFixed(2));


  // ====================================
  // 3. GET STUDENT ASSESSMENT MARKS
  // ====================================

  const studentMarks =
    await prisma.studentMark.findMany({
      where: {
        enrollmentId: id,
      },

      include: {
        assessmentActivity: {
          include: {
            assessment: true,
          },
        },
      },
    });


  // ====================================
  // 4. GROUP MARKS BY ASSESSMENT
  // ====================================

  const assessments = {};

  for (const studentMark of studentMarks) {
    const activity =
      studentMark.assessmentActivity;

    const assessment =
      activity.assessment;
        if (assessment.type === "ATTENDANCE") {
    continue;
  }

    // Create assessment object
    if (!assessments[assessment.id]) {
      assessments[assessment.id] = {
        id: assessment.id,

        name: assessment.name,

        type: assessment.type,

        maxMarks:
          Number(assessment.maxMarks),

        obtainedMarks: 0,
      };
    }

    // Add student's activity mark
    assessments[
      assessment.id
    ].obtainedMarks +=
      Number(studentMark.marks);
  }


  // ====================================
  // 5. SEPARATE MIDTERM & EVALUATION
  // ====================================

  const midterms = [];
  const evaluations = [];

  for (
    const assessment
    of Object.values(assessments)
  ) {

    // -------------------------------
    // MIDTERM
    // -------------------------------

    if (
      assessment.type === "MIDTERM"
    ) {
      midterms.push(assessment);
    }


    // -------------------------------
    // EVALUATION
    // -------------------------------

    else if (
      assessment.type === "EVALUATION"
    ) {
      evaluations.push(assessment);
    }
  }


  // ====================================
  // 6. VALIDATE MIDTERM COUNT
  // ====================================

  if (midterms.length > 2) {
    throw new Error(
      "A course can have maximum two MIDTERM assessments"
    );
  }


  // ====================================
  // 7. MIDTERM → /20
  // ====================================

  let midtermObtainedMarks = 0;
  let midtermMaximumMarks = 0;

  for (const midterm of midterms) {

    // Student's obtained marks
    midtermObtainedMarks +=
      Number(midterm.obtainedMarks);

    // Exam's actual maximum marks
    midtermMaximumMarks +=
      Number(midterm.maxMarks);
  }

  let midtermResult = 0;

  if (midtermMaximumMarks > 0) {

    midtermResult =
      (
        midtermObtainedMarks /
        midtermMaximumMarks
      ) * 20;
  }

  midtermResult =
    Number(midtermResult.toFixed(2));


  // ====================================
  // 8. EVALUATION → /10
  // ====================================

  let evaluationObtainedMarks = 0;
  let evaluationMaximumMarks = 0;

  for (const evaluation of evaluations) {

    evaluationObtainedMarks +=
      Number(evaluation.obtainedMarks);

    evaluationMaximumMarks +=
      Number(evaluation.maxMarks);
  }

  let evaluationResult = 0;

  if (evaluationMaximumMarks > 0) {

    evaluationResult =
      (
        evaluationObtainedMarks /
        evaluationMaximumMarks
      ) * 10;
  }

  evaluationResult =
    Number(evaluationResult.toFixed(2));


  // ====================================
  // 9. ASSESSMENT TOTAL → /40
  // ====================================

  const assessmentResult =
    Number(
      (
        attendanceResult +
        midtermResult +
        evaluationResult
      ).toFixed(2)
    );


  // ====================================
  // 10. FIND FINAL EXAM
  // ====================================

  const finalExam =
    await prisma.exam.findFirst({
      where: {
        courseOfferingId,

        type: "FINAL",
      },
    });

  if (!finalExam) {
    throw new Error(
      "Final exam not found"
    );
  }


  // ====================================
  // 11. FIND STUDENT FINAL EXAM MARK
  // ====================================

  const examMark =
    await prisma.examMark.findFirst({
      where: {
        examId: finalExam.id,

        enrollmentId: id,
      },
    });

  if (!examMark) {
    throw new Error(
      "Final exam mark not found"
    );
  }


  // ====================================
  // 12. FINAL EXAM → /60
  // ====================================

  const rawExamMarks =
    Number(examMark.marks);

  const examMaximumMarks =
    Number(finalExam.maxMarks);

  if (examMaximumMarks <= 0) {
    throw new Error(
      "Final exam maximum marks must be greater than 0"
    );
  }

  const examResult =
    (
      rawExamMarks /
      examMaximumMarks
    ) * 60;

  const roundedExamResult =
    Number(
      examResult.toFixed(2)
    );


  // ====================================
  // 13. FINAL RESULT → /100
  // ====================================

  const totalMarks =
    Number(
      (
        assessmentResult +
        roundedExamResult
      ).toFixed(2)
    );


  // ====================================
  // 14. CALCULATE GRADE
  // ====================================

  const {
    grade,
    gradePoint,
  } = calculateGrade(totalMarks);


  // ====================================
  // 15. SAVE COURSE RESULT
  // ====================================

  const result =
    await prisma.courseResult.upsert({

      where: {
        enrollmentId: id,
      },

      update: {
        assessmentResult,

        examResult:
          roundedExamResult,

        totalMarks,

        grade,

        gradePoint,
      },

      create: {
        enrollmentId: id,

        assessmentResult,

        examResult:
          roundedExamResult,

        totalMarks,

        grade,

        gradePoint,
      },
    });


  // ====================================
  // 16. RETURN RESULT
  // ====================================

  return result;
};


// ====================================
// GET ALL COURSE RESULTS
// ====================================

const getAllCourseResults =
  async () => {

    return await prisma.courseResult.findMany({

      include: {
        enrollment: true,
      },

      orderBy: {
        id: "desc",
      },
    });
  };


// ====================================
// GET RESULT BY ENROLLMENT
// ====================================

const getCourseResultByEnrollment =
  async (enrollmentId) => {

    const result =
      await prisma.courseResult.findUnique({

        where: {
          enrollmentId:
            Number(enrollmentId),
        },

        include: {
          enrollment: true,
        },
      });

    if (!result) {
      throw new Error(
        "Course result not found"
      );
    }

    return result;
  };


// ====================================
// EXPORT
// ====================================

module.exports = {
  generateCourseResult,
  getAllCourseResults,
  getCourseResultByEnrollment,
};