require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// DB
const mongoConn = async () => {
  try {
    await mongoose.connect(process.env.MONGODB || process.env.MONGO_URL);
    console.log("mongodb is connected.");
  } catch (error) {
    console.log(error.message);
  }
};
mongoConn();

/**
 *  API
 */

const authRoute = require("./route/authRouters");
const userRoute = require("./route/userRouters");
const productRoute = require("./route/productRouters");
const orderRoute = require("./route/orderRouters");
app.use("/api/orders", orderRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
