const service = require("../services/courseRegistration.service");

// Create registration
const createCourseRegistration = async (req, res) => {
  try {
    const registration = await service.createCourseRegistration(req.body);

    res.status(201).json({
      success: true,
      message: "Course registration created successfully",
      data: registration,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all registrations
const getAllCourseRegistrations = async (req, res) => {
  try {
    const registrations = await service.getAllCourseRegistrations();

    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one registration
const getCourseRegistrationById = async (req, res) => {
  try {
    const registration = await service.getCourseRegistrationById(
      req.params.id
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Course registration not found",
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get registrations by student
const getRegistrationsByStudent = async (req, res) => {
  try {
    const registrations = await service.getRegistrationsByStudent(
      req.params.studentId
    );

    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update status
const updateRegistrationStatus = async (req, res) => {
  try {
    const registration = await service.updateRegistrationStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      message: "Registration status updated successfully",
      data: registration,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete registration
const deleteCourseRegistration = async (req, res) => {
  try {
    await service.deleteCourseRegistration(req.params.id);

    res.json({
      success: true,
      message: "Course registration deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCourseRegistration,
  getAllCourseRegistrations,
  getCourseRegistrationById,
  getRegistrationsByStudent,
  updateRegistrationStatus,
  deleteCourseRegistration,
};