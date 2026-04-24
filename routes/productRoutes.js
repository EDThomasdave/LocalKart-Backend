import express from "express";
import {
  getProducts,
  addProduct,
  addProductsBulk,
  deleteProduct
} from "../controllers/productController.js";

import { upload } from "../middlewares/upload.js";

const router = express.Router();

// ✅ GET PRODUCTS
router.get("/", getProducts);

// ✅ ADD PRODUCT (WITH IMAGE UPLOAD)
router.post("/", upload.single("image"), addProduct);

// ✅ BULK INSERT
router.post("/bulk", addProductsBulk);

// ✅ DELETE
router.delete("/:id", deleteProduct);

export default router;