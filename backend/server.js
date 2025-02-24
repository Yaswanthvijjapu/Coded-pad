require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/code", require("./routes/codeRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
