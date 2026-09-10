const express = require("express");

const router = express.Router();

const paymentGateway = require("../payment/gateway");
const studentPaymentService =
    require("../services/studentPayment.service");


// Render the sandbox checkout page
router.get("/sandbox/checkout/:reference", (req, res) => {
    const session = paymentGateway.getSession(
        req.params.reference
    );

    if (!session) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>EduCore Payments</title>
                </head>
                <body style="font-family: system-ui; text-align: center; padding-top: 80px;">
                    <h2>Invalid or expired payment session</h2>
                    <p>Please return to the portal and try again.</p>
                    <a href="http://localhost:5176/student/payments" style="color: #4f46e5;">Back to Payments</a>
                </body>
            </html>
        `);
    }

    const amount = Number(session.amount || 0).toFixed(2);

    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Checkout - EduCore</title>
            </head>
            <body style="font-family: system-ui, sans-serif; background: #f1f5f9; margin: 0; padding: 0;">
                <div style="max-width: 440px; margin: 60px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); padding: 40px;">
                    <h1 style="margin: 0 0 4px; color: #0f172a; font-size: 22px;">EduCore Sandbox Gateway</h1>
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                        Simulated payment (no real money is charged)
                    </p>

                    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #0f172a; font-weight: 600; font-size: 16px;">
                            ${session.description || "University fee"}
                        </p>
                        <p style="margin: 8px 0 0; color: #0f172a; font-weight: 700; font-size: 26px;">
                            ৳ ${amount}
                        </p>
                        <p style="margin: 12px 0 0; color: #64748b; font-size: 12px;">
                            Reference: ${session.reference}
                        </p>
                    </div>

                    <div id="status" style="margin-bottom: 20px;"></div>

                    <button id="payBtn" onclick="confirmPayment()"
                        style="width: 100%; background: #2563eb; color: #ffffff; border: none; border-radius: 10px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer;">
                        Confirm Payment
                    </button>

                    <a href="http://localhost:5176/student/payments"
                        style="display: block; text-align: center; margin-top: 16px; color: #475569; font-size: 14px;">
                        Cancel and return to portal
                    </a>
                </div>

                <script>
                    async function confirmPayment() {
                        var btn = document.getElementById("payBtn");
                        var status = document.getElementById("status");

                        btn.disabled = true;
                        btn.textContent = "Processing...";

                        try {
                            var response = await fetch("/api/payments/webhook/sandbox", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    reference: "${session.reference}"
                                })
                            });

                            var result = await response.json();

                            if (response.ok) {
                                status.innerHTML =
                                    '<div style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px; font-size: 14px;">' +
                                    'Payment successful! Your fee has been marked as paid.</div>';

                                btn.textContent = "Done";
                                btn.style.background = "#059669";
                                btn.style.cursor = "default";

                                setTimeout(function () {
                                    window.location.href = "http://localhost:5176/student/payments";
                                }, 1500);
                            } else {
                                status.innerHTML =
                                    '<div style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 10px; padding: 12px; font-size: 14px;">' +
                                    (result.message || "Payment could not be processed") + "</div>";

                                btn.disabled = false;
                                btn.textContent = "Try Again";
                            }
                        } catch (error) {
                            status.innerHTML =
                                '<div style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 10px; padding: 12px; font-size: 14px;">' +
                                "Network error, please try again.</div>";

                            btn.disabled = false;
                            btn.textContent = "Try Again";
                        }
                    }
                </script>
            </body>
        </html>
    `);
});


// Sandbox webhook - simulates the gateway confirming a payment
router.post("/webhook/sandbox", async (req, res) => {
    try {
        const { reference } = req.body;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "reference is required"
            });
        }

        const session =
            paymentGateway.getSession(reference);

        if (!session) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment session not found or expired"
            });
        }

        paymentGateway.completeSession(reference);

        await studentPaymentService.updatePaymentStatus(
            session.paymentId,
            "PAID"
        );

        res.json({
            success: true,
            message: "Payment verified",
            data: {
                paymentId: session.paymentId,
                reference
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to process payment"
        });
    }
});


module.exports = router;