const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  codeId: {
    type: String,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    default: "", // Default to empty string if not provided
  },
}, { timestamps: true });

module.exports = mongoose.model("Code", CodeSchema);