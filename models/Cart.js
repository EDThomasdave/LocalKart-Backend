import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      name: String,
      price: Number,
      store: {
        name: String,
        lat: Number,
        lng: Number
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);