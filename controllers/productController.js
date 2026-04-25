import Product from "../models/Product.js";

// ✅ GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { search, category, store } = req.query;

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

    // ✅ 👉 PUT YOUR TAG FILTER HERE
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);

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