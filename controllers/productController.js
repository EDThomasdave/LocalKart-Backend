import Product from "../models/Product.js";

// ✅ GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 debug line

    const { name, price, image, store } = req.body;

    // 🔴 basic validation
    if (!name || !price || !store) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const product = new Product({
      name,
      price,
      image,
      store
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (err) {
    console.log("ADD ERROR:", err); // 🔥 show real error
    res.status(500).json({ msg: "Error adding product" });
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