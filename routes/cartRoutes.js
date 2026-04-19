import express from "express";
import { addToCart, getCart, decreaseFromCart } from "../controllers/cartController.js";


const router = express.Router();

// ➕ add to cart
router.post("/add", addToCart);

// 📦 get cart
router.get("/:userId", getCart);

router.put("/decrease", decreaseFromCart);
export default router;