import Store from "../models/Store.js";

// ✅ REGISTER STORE
export const registerStore = async (req, res) => {
  try {
    const { name, ownerName, email, password, lat, lng } = req.body;

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
      password, // later we hash this
      location: { lat, lng }
    });

    await store.save();

    res.status(201).json({ msg: "Store registered successfully", store });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error registering store" });
  }
};