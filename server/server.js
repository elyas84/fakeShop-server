require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
//const DEV_ENV = "http://localhost:3000";
const PROD_ENV = "https://fakeshop-client-o4mz.onrender.com";
app.use(cors({ origin: PROD_ENV, credentials: true }));
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

// see if production works well.
// cd client and run npm run build

// if (process.env.NODE_ENV === "prod") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(path.resolve(), "client", "build", "index.html")); //relative path
//   });
// } else {
//  res.send("API is running...");
// }

// STRIPEs
const stripePaymentRouter = require("./route/stripePaymantRoute");
app.use("/api/payment", stripePaymentRouter);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
