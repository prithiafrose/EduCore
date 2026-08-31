const feeService = require("../services/fee.service");

// Create Fee
const createFee = async (req, res) => {
  try {
    const fee = await feeService.createFee(req.body);

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      data: fee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all Fees
const getAllFees = async (req, res) => {
  try {
    const fees = await feeService.getAllFees();

    res.json({
      success: true,
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Fee by ID
const getFeeById = async (req, res) => {
  try {
    const fee = await feeService.getFeeById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.json({
      success: true,
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Fees by Program
const getFeesByProgram = async (req, res) => {
  try {
    const fees = await feeService.getFeesByProgram(
      req.params.programId
    );

    res.json({
      success: true,
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Fees by Semester
const getFeesBySemester = async (req, res) => {
  try {
    const fees = await feeService.getFeesBySemester(
      req.params.academicSemesterId
    );

    res.json({
      success: true,
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Fee
const updateFee = async (req, res) => {
  try {
    const fee = await feeService.updateFee(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Fee updated successfully",
      data: fee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Fee
const deleteFee = async (req, res) => {
  try {
    await feeService.deleteFee(req.params.id);

    res.json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFee,
  getAllFees,
  getFeeById,
  getFeesByProgram,
  getFeesBySemester,
  updateFee,
  deleteFee,
};