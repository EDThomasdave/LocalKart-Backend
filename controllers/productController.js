import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// ✅ GET PRODUCTS (keep yours same)
export const getProducts = async (req, res) => {
  try {
    const { search, category, store, tag } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (store) {
      filter.store = store;
    }

    if (tag) {
      filter.tags = tag;
    }

    const products = await Product.find(filter)
      .populate({
        path: "store",
        select: "name location"
      })
      .sort({ createdAt: -1 });

    const safeProducts = products.map(p => ({
      ...p._doc,
      store: p.store || null
    }));

    res.json(safeProducts);

  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// ✅ FIXED ADD PRODUCT (🔥 THIS IS IMPORTANT)
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, price, store } = req.body;
    const tags = req.body?.tags ? req.body.tags.split(",") : [];

    if (!name || !price || !store) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    let image = "";

    if (req.file) {
      console.log("Uploading to Cloudinary...");

      const result = await cloudinary.uploader.upload(req.file.path);

      console.log("CLOUDINARY URL:", result.secure_url);

      image = result.secure_url;

      // cleanup local file
      fs.unlinkSync(req.file.path);
    }

    const product = new Product({
      name,
      price: Number(price),
      image,
      store,
      tags
    });

    await product.save();

    res.status(201).json(product);

  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);
    res.status(500).json({ msg: "Error adding product" });
  }
};


// ✅ DELETE PRODUCT (unchanged)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.json({ msg: "Product deleted" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ msg: "Error deleting product" });
  }
};