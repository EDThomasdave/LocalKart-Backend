export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // 🔥 SAFE ACCESS (NO DESTRUCTURING)
    const name = req.body?.name;
    const price = req.body?.price;
    const store = req.body?.store;

    if (!name || !price || !store) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      price: Number(price),
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