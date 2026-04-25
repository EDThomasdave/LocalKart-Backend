import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { storeId } = req.body;

    console.log("ORDER for store:", storeId);

    const order = new Order({ storeId });
    await order.save();

    // 🔥 USE GLOBAL (SAFE)
    const socketId = global.storeSockets?.[String(storeId)];

    console.log("Socket found:", socketId);

    if (socketId && global.io) {
      global.io.to(socketId).emit("new-order", {
        msg: "🛒 New Order Received!"
      });
    }

    res.json({ msg: "Order placed" });

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ msg: "Order failed" });
  }
});

export default router;