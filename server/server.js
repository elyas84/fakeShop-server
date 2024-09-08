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
const DEV_ENV = "http://localhost:3000";
const PROD_ENV = "https://fakeshop-client-o4mz.onrender.com";
app.use(cors({ origin: PROD_ENV, credentials: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", PROD_ENV);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);
  next();
});

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

// STRIPEs
const stripePaymentRouter = require("./route/stripePaymantRoute");
app.use("/api/payment", stripePaymentRouter);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
