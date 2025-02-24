const express = require("express");
const Code = require("../models/Code");

const router = express.Router();

// Save Code
router.post("/save", async (req, res) => {
  try {
    const { code } = req.body;
    const newCode = new Code({ code });
    await newCode.save();
    res.json({ id: newCode._id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Code by ID
router.get("/:id", async (req, res) => {
  try {
    const codeData = await Code.findById(req.params.id);
    if (!codeData) return res.status(404).json({ error: "Not Found" });
    res.json({ code: codeData.code });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
