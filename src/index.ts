import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        // origin: "*",
    })
);

// MongoDB connection
const uri =
    "mongodb+srv://pushan:O0rv5jpt0ryy28gs@cluster0.bgz4rrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// URI is removed at the time of making repository public for security reasons

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

const orderSchema = new mongoose.Schema({
    user: {
        name: String,
        ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    items: [
        {
            name: String,
            quantity: Number,
            special_instructions: String,
        },
    ],

    price: Number,
    status: String, // pending, confirmed, delivered
    orderType: String, // cash or online
    transactionId: String,
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

// models

const User = mongoose.model("User", userSchema, "users");
const Item = mongoose.model("Item", itemSchema, "items");
const Inventory = mongoose.model("Inventory", inventorySchema, "inventory");
const Menu = mongoose.model("Menu", menuSchema, "menu");
const Order = mongoose.model("Order", orderSchema, "orders");

// request interfaces
interface incomingOrder {
    user: {
        name: string;
        email?: string;
        phone?: number;
    };
    items: {
        name: string;
        quantity: number;
    }[];
    price: number;
    orderType: string; // cash or online
}

// routes

app.post("/users", (req: Request, res: Response) => {
    const newUser = new User(req.body);
    newUser
        .save()
        .then((result: any) => {
            res.send({ Success: true });
        })
        .catch((err: any) => {
            res.status(500).send(err);
        });
});

app.post(
    "/placeorder",
    async (req: Request<any, any, incomingOrder>, res: Response) => {
        console.log("Order recieved");
        setTimeout;
        const { name } = req.body.user;

        const findUserId = async (name: string) => {
            const user = await User.findOne({ name: name });
            const userId = user?._id;
            return userId;
        };

        const userId = await findUserId(name);
        const orderItems = req.body.items;
        const orderPrice = req.body.price;
        const orderType = req.body.orderType;
        const status = "Pending";
        const transactionId = "testTxnId1234";

        const newOrder = new Order({
            user: {
                name: name,
                ref: userId,
            },
            items: orderItems,
            price: orderPrice,
            status: status,
            orderType: orderType,
            transactionId: transactionId,
        });
        newOrder
            .save()
            .then((result: any) => {
                console.log("Order placed successfully");
                console.log(result);
                res.send({ Success: true });
            })
            .catch((err: any) => {
                console.log(err);
                res.status(500).send(err);
            });
    }
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
