import express from "express";
import { registerStore } from "../controllers/storeController.js";

const router = express.Router();

router.post("/register", registerStore);

export default router;