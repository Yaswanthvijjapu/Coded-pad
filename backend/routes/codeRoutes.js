const express = require("express");
const Code = require("../models/Code");

const router = express.Router();

router.post("/", async (req, res) => {
  const { codeId, code = "" } = req.body;

  if (!codeId) {
    return res.status(400).json({ message: "codeId is required" });
  }

  try {
    let existingCode = await Code.findOne({ codeId });

    if (existingCode) {
      return res.json({ message: "Code ID already exists", existingCode });
    }

    const newCode = new Code({ codeId, code });
    await newCode.save();
    res.status(201).json({ message: "Code saved successfully", newCode });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// 📌 Update Code (PUT) - Called from Editor
router.put("/:codeId", async (req, res) => {
  const { code } = req.body;

  if (code === undefined) { // Only reject if code is explicitly undefined
    return res.status(400).json({ message: "Code field is required (can be empty)" });
  }

  try {
    let existingCode = await Code.findOne({ codeId: req.params.codeId });

    if (!existingCode) {
      return res.status(404).json({ message: "Code not found" });
    }

    existingCode.code = code;
    await existingCode.save();
    res.json({ message: "Code updated successfully", existingCode });
  } catch (error) {
    console.error("Error updating code:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// 📌 Get Code by ID (GET) - Called from Editor
router.get("/:codeId", async (req, res) => {
  try {
    let existingCode = await Code.findOne({ codeId: req.params.codeId });

    if (!existingCode) {
      existingCode = new Code({ codeId: req.params.codeId, code: "" });
      await existingCode.save();
    }

    res.json(existingCode);
  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
