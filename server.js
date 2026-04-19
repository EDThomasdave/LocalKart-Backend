import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";

dotenv.config();

const app = express();
// 🔥 MUST BE FIRST MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/api/cart", cartRoutes);
// ✅ optional


// ✅ routes AFTER json middleware
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/store", storeRoutes);
// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// server
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});