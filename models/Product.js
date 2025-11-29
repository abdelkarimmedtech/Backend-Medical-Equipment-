const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, default: "https://via.placeholder.com/250" },
  category: {
    type: String,
    required: true,
    enum: ["Diagnostic", "Surgical", "Therapy", "Monitoring", "Other"],
    default: "Other",
  },
});

module.exports = mongoose.model("Product", productSchema);
