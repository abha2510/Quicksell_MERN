const express = require("express");
const { UserModel } = require("../model/users.model");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../authentication/auth");
require("dotenv").config();
const { OrderModel } = require('../model/order.model');
const {ProductModel } = require('../model/product.model');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SALT_ROUNDS = 10;

// Buyer Signup
UserRouter.post("/signup/buyer", async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      type: "buyer",
      phoneNumber,
    });
    await newUser.save();

    res.status(201).json({
      msg: "Buyer saved successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json(error.message );
  }
});

// Seller Signup
UserRouter.post("/signup/seller", async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      type: "seller",
      phoneNumber,
    });
    await newUser.save();

    res.status(201).json({
      msg: "Seller saved successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json(error.message );
  }
});


UserRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ userType: "admin" }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ msg: "Admin Logged in Successfully!", token });
    }

    const user = await UserModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ msg: "Login Successfully!", token });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


UserRouter.get("/profile", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the user's profile
UserRouter.patch("/profile", async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

UserRouter.post("/logout", async (req, res) => {
  try {
    await UserModel.findByIdAndRemove(req.userId);
    res.json({ message: "Logged out and removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request password reset (Update the resetToken in the database)
UserRouter.post("/reset-password", async (req, res) => {
  try {
    // This could be a randomized token or OTP in a real scenario
    const resetToken = "RESET_VALUE";

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { resetToken },
      { new: true }
    );
    if (user) {
      res.json({ message: "Password reset requested" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm and apply password reset
UserRouter.patch("/reset-password", async (req, res) => {
  try {
    const { password, resetToken } = req.body;

    // Check if the resetToken from the user matches the one in the database
    const user = await UserModel.findOne({ _id: req.userId, resetToken });

    if (!user) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Update the password and clear the resetToken
    await UserModel.findByIdAndUpdate(
      req.userId,
      { password: hashedPassword, resetToken: null },
      { new: true }
    );
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

UserRouter.post("/place-order", auth, async (req, res) => {
  const user = await UserModel.findById(req.userId);
    
    if (user.type !== 'buyer') {
        return res.status(403).json({ message: "Only buyers can place orders!" });
    }
    
  try {
      const { products } = req.body; 

      let totalAmount = 0;
      for(let item of products) {
          const product = await ProductModel.findById(item.productId);
          if(product) {
              totalAmount += product.price ;
          } else {
              return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
          }
      }

      const newOrder = new OrderModel({
          user: req.userId,
          products,
          totalAmount
      });

      await newOrder.save();
      res.status(201).json({ msg: "Order placed successfully!", newOrder });

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// {
//   "products":[
//     {
//       "productId":"64e381ef4060d13bc591f929"
//     }
//     ]
// }


UserRouter.get('/my-orders', auth, async (req, res) => {
  try {
      const orders = await OrderModel.find({ user: req.userId }).populate('products.product');
      res.status(200).json(orders);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



module.exports = { UserRouter };
