const studentPaymentService = require("../services/studentPayment.service");
const studentService = require("../services/student.service");
const paymentGateway = require("../payment/gateway");
const prisma = require("../config/prisma");

const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char])
  );

// Download payment receipt (HTML)
const downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await prisma.studentPayment.findUnique({
      where: { id: Number(id) },
      include: {
        student: { include: { program: true } },
        fee: {
          include: {
            academicSemester: true,
            program: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Student payment not found",
      });
    }

    // Access control: admin or the owning student
    if (req.user?.role !== "ADMIN") {
      const student = await studentService.getStudentByUserId(
        req.user.userId
      );

      if (
        !student ||
        student.id !== payment.studentId
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message: "You can only download your own receipts",
          });
      }
    }

    const {
      student,
      fee,
      amount,
      status,
      paidAt,
      createdAt,
    } = payment;

    const feeName =
      fee.academicSemester && fee.academicSemester.name
        ? `${fee.type} - ${fee.academicSemester.name}`
        : fee.type;

    const receiptNo = `RCP-${String(payment.id).padStart(
      6,
      "0"
    )}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Payment Receipt - ${escapeHtml(receiptNo)}</title>
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
    margin: 0;
    padding: 40px;
    background: #f3f4f6;
  }
  .receipt {
    max-width: 720px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 32px 40px;
  }
  h1 {
    margin: 0;
    font-size: 22px;
    color: #111827;
  }
  .subtitle {
    color: #6b7280;
    font-size: 12px;
    margin-top: 4px;
  }
  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 20px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  td {
    padding: 6px 0;
    vertical-align: top;
  }
  .label {
    color: #6b7280;
    width: 40%;
  }
  .value {
    color: #111827;
    font-weight: 600;
  }
  .amount {
    font-size: 26px;
    font-weight: 700;
    color: #059669;
    text-align: right;
  }
  .status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .status.paid {
    background: #d1fae5;
    color: #047857;
  }
  .status.pending {
    background: #fef3c7;
    color: #b45309;
  }
  .status.failed,
  .status.cancelled {
    background: #fee2e2;
    color: #b91c1c;
  }
  .footer {
    margin-top: 24px;
    font-size: 12px;
    color: #6b7280;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="receipt">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <h1>EduCore University</h1>
        <div class="subtitle">Payment Receipt</div>
      </div>
      <div style="text-align:right;">
        <div class="value">${escapeHtml(
          receiptNo
        )}</div>
        <div class="subtitle">${escapeHtml(
          new Date(createdAt).toLocaleDateString()
        )}</div>
      </div>
    </div>

    <hr />

    <table>
      <tr>
        <td class="label">Student Name</td>
        <td class="value">${escapeHtml(
          student.name
        )}</td>
      </tr>
      <tr>
        <td class="label">Student ID</td>
        <td class="value">${escapeHtml(
          student.studentId
        )}</td>
      </tr>
      <tr>
        <td class="label">Program</td>
        <td class="value">${escapeHtml(
          student.program?.name || "N/A"
        )}</td>
      </tr>
      <tr>
        <td class="label">Email</td>
        <td class="value">${escapeHtml(
          student.email
        )}</td>
      </tr>
    </table>

    <hr />

    <table>
      <tr>
        <td class="label">Fee Type</td>
        <td class="value">${escapeHtml(
          feeName
        )}</td>
      </tr>
      <tr>
        <td class="label">Program (Fee)</td>
        <td class="value">${escapeHtml(
          fee.program?.name || "N/A"
        )}</td>
      </tr>
      <tr>
        <td class="label">Status</td>
        <td>
          <span class="status ${(status || "")
            .toLowerCase()}">${escapeHtml(
            status
          )}</span>
        </td>
      </tr>
      <tr>
        <td class="label">Paid On</td>
        <td class="value">${escapeHtml(
          paidAt
            ? new Date(paidAt).toLocaleDateString()
            : "N/A"
        )}</td>
      </tr>
    </table>

    <hr />

    <div style="display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <div class="label">Amount Paid</div>
        <div class="amount">${escapeHtml(
          Number(amount).toFixed(2)
        )} BDT</div>
      </div>
      <div style="text-align:right;">
        <div class="subtitle">Payment Reference</div>
        <div class="value">${escapeHtml(
          payment.reference || `SP-${payment.id}`
        )}</div>
      </div>
    </div>

    <div class="footer">
      Generated by EduCore | This is a system-generated receipt.
    </div>
  </div>
</body>
</html>`;

    res.set(
      "Content-Type",
      "text/html"
    );
    res.set(
      "Content-Disposition",
      `inline; filename="${receiptNo}.html"`
    );
    res.send(html);
  } catch (error) {
    console.error("Receipt generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate receipt",
    });
  }
};

// Create payment
const createStudentPayment = async (req, res) => {
  try {
    const payment = await studentPaymentService.createStudentPayment(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Student payment created successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all payments
const getAllStudentPayments = async (req, res) => {
  try {
    const payments =
      await studentPaymentService.getAllStudentPayments();

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payment by ID
const getStudentPaymentById = async (req, res) => {
  try {
    const payment =
      await studentPaymentService.getStudentPaymentById(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Student payment not found",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payments by student
const getPaymentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (
      !Number.isInteger(Number(studentId)) ||
      Number(studentId) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const payments =
      await studentPaymentService.getPaymentsByStudent(
        req.params.studentId
      );

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const payment =
      await studentPaymentService.updatePaymentStatus(
        req.params.id,
        req.body.status
      );

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Checkout a payment (starts the gateway flow)
const checkoutStudentPayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    // Students can only checkout their own payments
    if (req.user.role !== "ADMIN") {
      const student =
        await studentService.getStudentByUserId(
          req.user.userId
        );

      const payment =
        await studentPaymentService.getStudentPaymentById(
          id
        );

      if (
        !payment ||
        !student ||
        student.id !== payment.studentId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only checkout your own payments",
        });
      }
    }

    const session =
      await studentPaymentService.createCheckout(id);

    const checkoutUrl = paymentGateway.getCheckoutUrl(
      session.reference,
      req
    );

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      data: {
        reference: session.reference,
        checkoutUrl,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete payment
const deleteStudentPayment = async (req, res) => {
  try {
    await studentPaymentService.deleteStudentPayment(
      req.params.id
    );

    res.json({
      success: true,
      message: "Student payment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudentPayment,
  getAllStudentPayments,
  getStudentPaymentById,
  getPaymentsByStudent,
  updatePaymentStatus,
  checkoutStudentPayment,
  downloadReceipt,
  deleteStudentPayment,
};