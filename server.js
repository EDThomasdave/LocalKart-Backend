import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import { Server } from "socket.io";
import http from "http"; // ✅ IMPORTANT

dotenv.config();

const app = express();

// 🔥 MUST BE FIRST MIDDLEWARE
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// ROUTES
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/store", storeRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));


// ✅ CREATE SERVER (IMPORTANT)
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔥 STORE SOCKETS MAP
let storeSockets = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // store joins
  socket.on("joinStore", (storeId) => {
    storeSockets[storeId] = socket.id;
    console.log("Store joined:", storeId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ✅ EXPORT FOR USE IN CONTROLLERS
export { io, storeSockets };

// 🚀 START SERVER
server.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});