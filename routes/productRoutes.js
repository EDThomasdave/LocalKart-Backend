import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  getProductsByStore
} from "../controllers/productController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

// ✅ Get all products (optional)
router.get("/", getProducts);

// 🔥 Get products for specific store
router.get("/store/:storeId", getProductsByStore);

// ➕ Add product
router.post("/", upload.single("image"), addProduct);

// ❌ Delete product
router.delete("/:id", deleteProduct);

export default router;