require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DATABASE_URL = process.env.DATABASE_URL;
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const basketRoutes = require("./routes/basketRoutes");

app.use(express.json());
app.use(cors());

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/product", productRoutes);
app.use("/basket", basketRoutes);

app.listen(8003, () => {
  console.log("Server running on  port 8003");
});
