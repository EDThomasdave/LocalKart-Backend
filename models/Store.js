import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  phone: String,
  address: String,
  city: String,
  state: String,
  gst: String,

  location: {
    lat: Number,
    lng: Number
  }

}, { timestamps: true });

export default mongoose.model("Store", storeSchema);