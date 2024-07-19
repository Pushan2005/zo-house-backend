const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const uri =
    "mongodb+srv://pushan:O0rv5jpt0ryy28gs@cluster0.bgz4rrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    dbName: "zo",
});

// schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    wallet: String,
    debt: Number,
});

const itemSchema = new mongoose.Schema({
    name: String,
    sku: String,
    category: String,
});

const inventorySchema = new mongoose.Schema({
    item: {
        name: String,
        sku: String,
        category: String,
    },
    quantity: Number,
    price: Number,
});

const menuSchema = new mongoose.Schema({
    item: String,
    category: String,
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    item: String,
    price: Number,
    status: String, // pending, confirmed, delivered
    orderType: String,
    transactionId: String,
});

// models

const User = mongoose.model("User", userSchema, "users");
const Item = mongoose.model("Item", itemSchema, "items");
const Inventory = mongoose.model("Inventory", inventorySchema, "inventory");
const Menu = mongoose.model("Menu", menuSchema, "menu");
const Order = mongoose.model("Order", orderSchema, "orders");

// routes

app.post("/users", (req, res) => {
    const newUser = User(req.body);
    newUser
        .save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
