import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);