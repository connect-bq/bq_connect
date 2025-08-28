require("dotenv").config();
const express = require("express");
const connectDB = require("./database");
const userRoutes = require("./routes/user-router");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("✅ API Running");
});

// Routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
