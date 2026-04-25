import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();

// 🔥 LOGGING
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// ✅ MUST COME FIRST
app.use(cors({ origin: "*" }));
app.use(express.json());

// ROUTES
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/order", orderRoutes);
app.use("/uploads", express.static("uploads"));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: { origin: "*" }
});

let storeSockets = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinStore", (storeId) => {
    storeSockets[String(storeId)] = socket.id; // 🔥 FIX
    console.log("Store joined:", storeId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ✅ MAKE GLOBAL
global.io = io;
global.storeSockets = storeSockets;

// START
server.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});