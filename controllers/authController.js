import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 🔥 REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // 🔍 check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧾 create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // ✅ return user with _id
    res.status(201).json({
      msg: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// 🔐 LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔑 generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ return correct user object
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};