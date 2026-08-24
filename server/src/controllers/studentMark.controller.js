const {
    createStudentMark,
    updateStudentMark,
    getStudentMarkById,
    getAllStudentMarks,
    deleteStudentMark,
        getMarksByEnrollment,
        getMarksByActivity

} = require("../services/studentMark.service");
const getAll = async (req, res) => {
    try {
        const studentMarks = await getAllStudentMarks();

        res.status(200).json({
            success: true,
            data: studentMarks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const studentMark = await getStudentMarkById(id);

        res.status(200).json({
            success: true,
            data: studentMark
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const create = async (req, res) => {
    try {
        const {
            enrollmentId,
            assessmentActivityId,
            marks
        } = req.body;

        if (
            enrollmentId === undefined ||
            assessmentActivityId === undefined ||
            marks === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "enrollmentId, assessmentActivityId and marks are required"
            });
        }

        const studentMark = await createStudentMark({
            enrollmentId: Number(enrollmentId),
            assessmentActivityId: Number(assessmentActivityId),
            marks
        });

        res.status(201).json({
            success: true,
            message: "Student mark created successfully",
            data: studentMark
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const update = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { marks } = req.body;

        if (marks === undefined) {
            return res.status(400).json({
                success: false,
                message: "marks is required"
            });
        }

        const studentMark = await updateStudentMark(
            id,
            marks
        );

        res.status(200).json({
            success: true,
            message: "Student mark updated successfully",
            data: studentMark
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await deleteStudentMark(id);

        res.status(200).json({
            success: true,
            message: "Student mark deleted successfully"
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
const getByEnrollment = async (req, res) => {
    try {
        const enrollmentId = Number(req.params.enrollmentId);

        const marks = await getMarksByEnrollment(enrollmentId);

        res.status(200).json({
            success: true,
            data: marks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getByActivity = async (req, res) => {
    try {
        const assessmentActivityId =
            Number(req.params.assessmentActivityId);

        const marks =
            await getMarksByActivity(assessmentActivityId);

        res.status(200).json({
            success: true,
            data: marks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    create,
    update,
    getById,
    getAll,
    remove,
    getByEnrollment,
    getByActivity
};