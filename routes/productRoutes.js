const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ===============================
//  GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
//  GET PRODUCT BY ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, stock, image, category  } = req.body;

    
    if (!name || !description || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      image: image || "https://via.placeholder.com/250", 
      category: category || "Other", 
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res
      .status(200)
      .json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/:id/reduce-stock", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: "Sorry, we don't have enough stock available",
        availableStock: product.stock 
      });
    }

    product.stock -= quantity;
    await product.save();

    res.status(200).json({ 
      message: "Stock reduced successfully", 
      product 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/:id/increase-stock", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock += quantity;
    await product.save();

    res.status(200).json({ 
      message: "Stock increased successfully", 
      product 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
