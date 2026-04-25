import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,

  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  total: Number,

  status: {
    type: String,
    enum: ["pending", "fulfilled", "completed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);