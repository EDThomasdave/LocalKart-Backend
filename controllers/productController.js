import Product from "../models/Product.js";

// ✅ GET PRODUCTS
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

    // ✅ IMPORTANT: populate store with ONLY required fields
    const products = await Product.find(filter)
      .populate({
        path: "store",
        select: "name location" // 👈 ensures location comes
      })
      .sort({ createdAt: -1 });

    // ✅ SAFETY: ensure no undefined crashes on frontend
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

// ✅ ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const name = req.body?.name;
    const price = req.body?.price;
    const store = req.body?.store;
    const tags = req.body?.tags ? req.body.tags.split(",") : [];

    if (!name || !price || !store) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

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

// ✅ DELETE PRODUCT
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