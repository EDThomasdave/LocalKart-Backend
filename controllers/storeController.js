export const registerStore = async (req, res) => {
  try {
    const { name, ownerName, email, password, location } = req.body;

    if (!name || !ownerName || !email || !password) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const existing = await Store.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Store already exists" });
    }

    const store = new Store({
      name,
      ownerName,
      email,
      password, // 🔐 later hash
      location // ✅ directly store object
    });

    await store.save();

    res.status(201).json({
      msg: "Store registered successfully",
      store: {
        id: store._id,
        name: store.name,
        email: store.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error registering store" });
  }
};