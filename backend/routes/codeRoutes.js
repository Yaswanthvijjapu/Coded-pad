const express = require("express");
const Code = require("../models/Code");

const router = express.Router();

// 📌 Save Code
router.post("/", async (req, res) => {
    const { codeId, code } = req.body;

    if (!codeId || !code) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newCode = new Code({ codeId, code });
        await newCode.save();
        res.status(201).json({ message: "Code saved successfully", newCode });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 📌 Update Code
router.put("/:codeId", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let existingCode = await Code.findOne({ codeId: req.params.codeId });

        if (!existingCode) {
            return res.status(404).json({ message: "Code not found" });
        }

        // ✅ Update existing code
        existingCode.code = code;
        await existingCode.save();
        res.json({ message: "Code updated successfully", existingCode });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 📌 Get Code by ID
router.get("/:codeId", async (req, res) => {
    try {
        const existingCode = await Code.findOne({ codeId: req.params.codeId });

        if (!existingCode) {
            return res.status(404).json({ message: "Code not found" });
        }

        res.json(existingCode);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
