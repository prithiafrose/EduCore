const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const departments = await prisma.department.findMany();

        res.json(departments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch departments"
        });
    }
});

module.exports = router;