require("dotenv").config();
const os = require('os');
const cluster = require('cluster')
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DATABASE_URL = process.env.DATABASE_URL;
const app = express();
const cpuNum = os.cpus().length
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const basketRoutes = require("./routes/basketRoutes");

app.use(express.json());
app.use(cors());

if (cluster.isMaster) {
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }


  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker with pid  ${worker.process.pid} died`)
  })
}
else {
  app.listen(8005, () => {
    console.log(`Server running on  ${process.pid} 8005`);
  });
}





mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

app.use("/auth", authRoutes)
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/product", productRoutes);
app.use("/basket", basketRoutes);

// app.listen(8003, () => {
//   console.log("Server running on  port 8003");
// });
