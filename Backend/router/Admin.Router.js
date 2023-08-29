const express = require('express');
const { UserModel } = require('../model/users.model');
const { OrderModel } = require('../model/order.model');
const { auth } = require('../authentication/auth');
const AdminRouter = express.Router();

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.userType !== "admin") {
        return res.status(403).json({ message: "Unauthorized access. Admin only." });
    }
    next();
}

// View all sellers
AdminRouter.get('/sellers', auth, isAdmin, async (req, res) => {
    try {
        const sellers = await UserModel.find({ type: "seller" });
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View all buyers
AdminRouter.get('/buyers', auth, isAdmin, async (req, res) => {
    try {
        const buyers = await UserModel.find({ type: "buyer" });
        res.json(buyers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View all orders with detailed info
AdminRouter.get('/orders', auth, isAdmin, async (req, res) => {
    try {
        const orders = await OrderModel.find().populate('user').populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { AdminRouter };
