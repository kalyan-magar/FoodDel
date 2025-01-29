import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import "dotenv/config";
import carRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App configuration
const app = express();
const port = 400;

// Middleware
app.use(express.json());  // Fix the call to express.json()
app.use(cors());

//DB Connection
connectDB();

//api endpoints 
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads')); //
app.use("/api/user",userRouter);
app.use("/api/cart",carRouter);
app.use("/api/order",orderRouter);

app.get("/", (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
