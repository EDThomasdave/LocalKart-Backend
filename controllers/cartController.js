import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ➕ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // ✅ ONLY store productId
      cart.items.push({
        productId,
        quantity: 1
      });
    }

    await cart.save();

    res.json(cart);

  } catch (err) {
    console.log("CART ERROR:", err);
    res.status(500).json({ msg: "Error adding to cart" });
  }
};
// 📦 GET CART
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        model: "Product",
        populate: {
          path: "store",
          model: "Store",
          select: "name location"
        }
      });

    if (!cart) {
      return res.json({ items: [] });
    }

    const formatted = cart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity
    }));

    res.json({ items: formatted });

  } catch (err) {
    console.log("GET CART ERROR:", err);
    res.status(500).json({ msg: "Error fetching cart" });
  }
};
export const decreaseFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }

        const item = cart.items.find(i => i.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ msg: "Item not in cart" });
        }

        // 🔥 decrease logic
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // remove item if 0
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        }

        await cart.save();

        res.json(cart);

    } catch (err) {
        console.log("DECREASE ERROR:", err);
        res.status(500).json({ msg: "Error decreasing item" });
    }
};