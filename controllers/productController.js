import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    // 🔍 SEARCH BY NAME
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🏷️ FILTER BY CATEGORY (optional)
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    res.json(products);

  } catch (err) {
    console.log("SEARCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const addProductsBulk = async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Bulk insert error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, tags } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      price,
      image,
      store: req.body.store
    });

    await product.save();

    res.json(product);
  } catch (err) {
  console.log("ADD PRODUCT ERROR:", err); // 🔥 ADD THIS
  res.status(500).json({ msg: "Error adding product" });
}
};

