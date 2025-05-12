const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  codeId: {
    type: String,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    default: "", 
  },
}, { timestamps: true });

module.exports = mongoose.model("Code", CodeSchema);
