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
      password,
      location
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


// ✅ ADD THIS BACK
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
    res.status(500).json({ msg: "Login error" });
  }
};