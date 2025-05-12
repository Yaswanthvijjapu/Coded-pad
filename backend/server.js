require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
const allowedOrigins = [
  "https://coded-pad-pied.vercel.app", // frontend (production)
  "http://localhost:5173"              // frontend (development)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE"
}));

  
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/code", require("./routes/codeRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
