require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user-router");
const routeRoutes = require("./routes/route-router");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(cors({
  origin: "*",
  methods: "*",
  allowedHeaders: "*"
}));
app.use(express.json());

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("✅ API Running");
});

// Routes
app.use("/users", userRoutes);
app.use("/routes", routeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
