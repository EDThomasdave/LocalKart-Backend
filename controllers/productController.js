import Product from "../models/Product.js";


// ✅ GET PRODUCTS (SEARCH + FILTER)
export const getProducts = async (req, res) => {
  try {
    const { search, category, store } = req.query;

    let filter = {};

    // 🔍 search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🏷️ optional category
    if (category) {
      filter.category = category;
    }

    // 🏪 filter by store (VERY IMPORTANT for dashboard)
    if (store) {
      filter.store = store;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



// ✅ ADD SINGLE PRODUCT
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, price, store } = req.body;

    // 🔥 validation
    if (!name || !price || !store) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      price: Number(price), // 🔥 ensure number
      image,
      store
    });

    await product.save();

    res.status(201).json(product);

  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);
    res.status(500).json({ msg: "Error adding product" });
  }
};



// ✅ BULK INSERT (OPTIONAL)
export const addProductsBulk = async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  } catch (err) {
    console.log("BULK INSERT ERROR:", err);
    res.status(500).json({ msg: "Bulk insert error" });
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