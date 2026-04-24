import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },

  // 🔥 FIXED STORE FIELD
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);