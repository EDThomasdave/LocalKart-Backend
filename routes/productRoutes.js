import express from "express";
import { getProducts, addProduct, addProductsBulk, deleteProduct  } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct); // 🔥 THIS LINE IS IMPORTANT
router.post("/bulk", addProductsBulk);
router.delete("/:id", deleteProduct);

export default router;