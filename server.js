const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 🔹 Simple test route
app.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" });
});

// Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
// You can keep productRoutes commented for now if you want
// app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✔ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✔ Server running on http://localhost:${PORT}`)
);
