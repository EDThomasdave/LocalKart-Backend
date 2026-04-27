export const loginStore = async (req, res) => {
  try {
    const { email, password } = req.body;

    const store = await Store.findOne({ email, password });

    if (!store) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({
      msg: "Login success",
      store   // ✅ IMPORTANT (send full store)
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Login error" });
  }
};