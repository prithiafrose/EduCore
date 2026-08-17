const studentService =
    require("../services/student.service");

const prisma = require("../config/prisma");


// GET all students
const getAllStudents = async (req, res) => {
    try {

        const students =
            await studentService.getAllStudents();

        res.status(200).json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch students"
        });
    }
};


// GET student by ID
const getStudentById = async (req, res) => {
    try {

        const { id } = req.params;


        // Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }


        const student =
            await studentService.getStudentById(id);


        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        res.status(200).json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch student"
        });
    }
};


// CREATE student
const createStudent = async (req, res) => {
    try {

        const {
            studentId,
            name,
            email,
            programId,
            userId
        } = req.body;


        // 1. Required fields
        if (
            !studentId ||
            !name ||
            !email ||
            programId === undefined ||
            userId === undefined
        ) {
            return res.status(400).json({
                message:
                    "studentId, name, email, programId and userId are required"
            });
        }


        // 2. Validate program ID
        if (
            !Number.isInteger(Number(programId)) ||
            Number(programId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }


        // 3. Validate user ID
        if (
            !Number.isInteger(Number(userId)) ||
            Number(userId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        // 4. Check user exists
        const user =
            await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // 5. Check user role
        if (user.role !== "STUDENT") {
            return res.status(400).json({
                message:
                    "User must have STUDENT role"
            });
        }


        // 6. Check program exists
        const program =
            await prisma.program.findUnique({
                where: {
                    id: Number(programId)
                }
            });


        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }


        // 7. Check whether user is already a student
        const existingUserStudent =
            await prisma.student.findUnique({
                where: {
                    userId: Number(userId)
                }
            });


        if (existingUserStudent) {
            return res.status(409).json({
                message:
                    "This user is already associated with a student"
            });
        }


        // 8. Create student
        const student =
            await studentService.createStudent(
                studentId,
                name,
                email,
                programId,
                userId
            );


        res.status(201).json(student);

    } catch (error) {

        console.error(error);


        // Unique constraint
        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "Student ID or email already exists"
            });
        }


        res.status(500).json({
            message: "Failed to create student"
        });
    }
};


// UPDATE student
const updateStudent = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            studentId,
            name,
            email,
            programId,
            userId
        } = req.body;


        // 1. Validate student ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }


        // 2. Required fields
        if (
            !studentId ||
            !name ||
            !email ||
            programId === undefined ||
            userId === undefined
        ) {
            return res.status(400).json({
                message:
                    "studentId, name, email, programId and userId are required"
            });
        }


        // 3. Validate program ID
        if (
            !Number.isInteger(Number(programId)) ||
            Number(programId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }


        // 4. Validate user ID
        if (
            !Number.isInteger(Number(userId)) ||
            Number(userId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        // 5. Check student exists
        const existingStudent =
            await studentService.getStudentById(id);


        if (!existingStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        // 6. Check user exists
        const user =
            await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // 7. Check user role
        if (user.role !== "STUDENT") {
            return res.status(400).json({
                message:
                    "User must have STUDENT role"
            });
        }


        // 8. Check program exists
        const program =
            await prisma.program.findUnique({
                where: {
                    id: Number(programId)
                }
            });


        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }


        // 9. Check whether another student
        // already uses this user
        const duplicateUser =
            await prisma.student.findFirst({
                where: {
                    userId: Number(userId),
                    NOT: {
                        id: Number(id)
                    }
                }
            });


        if (duplicateUser) {
            return res.status(409).json({
                message:
                    "This user is already associated with another student"
            });
        }


        // 10. Update
        const student =
            await studentService.updateStudent(
                id,
                studentId,
                name,
                email,
                programId,
                userId
            );


        res.status(200).json(student);

    } catch (error) {

        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "Student ID or email already exists"
            });
        }


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        res.status(500).json({
            message: "Failed to update student"
        });
    }
};


// DELETE student
const deleteStudent = async (req, res) => {
    try {

        const { id } = req.params;


        // Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }


        // Check student exists
        const existingStudent =
            await studentService.getStudentById(id);


        if (!existingStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        // Delete
        await studentService.deleteStudent(id);


        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error(error);


        // Related records exist
        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete student because related records exist"
            });
        }


        res.status(500).json({
            message: "Failed to delete student"
        });
    }
};


module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};