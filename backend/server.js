require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://coded-pad-pied.vercel.app",
    "http://localhost:5173" // Add your local development origin
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

  
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/code", require("./routes/codeRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
