export const registerStore = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 debug

    const {
      name,
      ownerName,
      email,
      password,
      phone,
      address,
      city,
      state,
      gst,
      location
    } = req.body;

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
      password,
      phone,
      address,
      city,
      state,
      gst,
      location
    });

    await store.save();

    res.status(201).json({
      msg: "Store registered successfully",
      store
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err); // 🔥 THIS WILL SHOW REAL ERROR
    res.status(500).json({ msg: "Error registering store" });
  }
};