import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct
} from "../controllers/productController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("image"), addProduct);
router.delete("/:id", deleteProduct);

export default router;