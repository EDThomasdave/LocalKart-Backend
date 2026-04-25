import express from "express";
import Order from "../models/Order.js";
import { io, storeSockets } from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { storeId } = req.body;

    const order = new Order({ storeId });
    await order.save();

    // 🎯 SEND ONLY TO THAT STORE
    const socketId = storeSockets[storeId];

    if (socketId) {
      io.to(socketId).emit("new-order", {
        msg: "🛒 New Order Received!"
      });
    }

    res.json({ msg: "Order placed" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Order failed" });
  }
});

export default router;