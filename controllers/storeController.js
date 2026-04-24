import Store from "../models/Store.js";

// ✅ REGISTER STORE
export const registerStore = async (req, res) => {
  try {
    console.log("BODY:", req.body);

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
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Error registering store" });
  }
};

// ✅ LOGIN STORE (THIS WAS MISSING)
export const loginStore = async (req, res) => {
  try {
    const { email, password } = req.body;

    const store = await Store.findOne({ email, password });

    if (!store) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({
      msg: "Login success",
      store: {
        id: store._id,
        name: store.name,
        email: store.email
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Login error" });
  }
};