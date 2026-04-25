import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },

  tags: [String] // ✅ ADD THIS

}, { timestamps: true });

export default mongoose.model("Product", productSchema);