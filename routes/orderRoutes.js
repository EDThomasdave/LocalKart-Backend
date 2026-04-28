import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


// 🛒 CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { storeId, items, total } = req.body;

    // ✅ Validation
    if (!storeId || !items || !total) {
      return res.status(400).json({ msg: "Missing order data" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Invalid items" });
    }

    console.log("ORDER for store:", storeId);

    const order = new Order({
      storeId,
      items,
      total,
      status: "pending"
    });

    await order.save();

    // 🔔 Real-time notification
    const socketId = global.storeSockets?.[String(storeId)];

    if (socketId && global.io) {
      global.io.to(socketId).emit("new-order", {
        msg: "🛒 New Order Received!",
        order
      });
    }

    // ✅ Return full order
    res.json(order);

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ msg: "Order failed" });
  }
});


// 📦 GET ORDERS FOR STORE
router.get("/store/:storeId", async (req, res) => {
  try {
    const orders = await Order.find({
      storeId: req.params.storeId
    }).sort({ createdAt: -1 }); // newest first

    res.json(orders);

  } catch (err) {
    console.log("FETCH ORDERS ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
});


// ✅ UPDATE ORDER STATUS → FULFILLED
router.put("/fulfill/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "fulfilled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    console.log("FULFILL ERROR:", err);
    res.status(500).json({ msg: "Failed to update order" });
  }
});


router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching order" });
  }
});

router.put("/fulfill/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "fulfilled" },
      { new: true }
    );

    // 🔥 ADD THIS
    global.io.emit("order-updated", order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update order" });
  }
});

export default router;