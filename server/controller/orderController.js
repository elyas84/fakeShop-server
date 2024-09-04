const Order = require("../model/Order");
const Product = require("../model/Product");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
exports.newOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }
  const {
    orderItems,
    firstname,
    lastname,
    email,
    mobileNumber,
    address,
    total,
    city,
  } = req.body;

  try {
    let order = new Order({
      orderItems,
      total,
      user: req.userId,
      firstname,
      lastname,
      email,
      mobileNumber,
      address,
      city,
    });
    // updateing in inStock
    let quanityFromOrderItems, prodoctIdFromOrderItems;
    orderItems.forEach((data) => {
      return (
        (quanityFromOrderItems = data.quanity),
        (prodoctIdFromOrderItems = data.product)
      );
    });

    const productToUpdate = await Product.findById(prodoctIdFromOrderItems);
    if (productToUpdate) {
      productToUpdate.inStock -= quanityFromOrderItems;
    }
    await productToUpdate.save();
    order = await order.save();
    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    let count = await Order.countDocuments({ user: req.userId });
    const myOrders = await Order.find({ user: req.userId }).populate(
      "user",
      "orderList"
    );
    if (myOrders && myOrders.length === 0) {
      return res.status(404).json({
        message: "There aren't any orders in your history right now!",
      });
    } else {
      return res.status(200).json({ myOrders, count });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "there was no order discovered. " });
    } else {
      return res.status(200).json(order);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

// paypal will take place here!
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.isPaid = true;
    await order.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDERESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: process.env.EMAIL_ADDERESS,
      to: process.env.EMAIL_ADDERESS,
      subject: "Deliver update from Fake-Shop",
      html: `
          <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=, initial-scale=1.0" />
        <title></title>
        <style>
          * {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          h1 {
            background-color: gray;
            width: 100%;
            height: 100%;
            padding: 5px;
            color: #fff;
          }
          p {
            color: gray;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          a {
            border: 1px solid lightgray;
            padding: 4px;
            margin: 0 10px;
          }
        </style>
      </head>

      <body>
        <h1>Deliver update from Fake-Shop</h1>
        <p>
        Hi Admin, Orders are now paid!.
        </p>

      </body>
    </html>
      `,
    };

    await transporter.sendMail(mailOption);

    return res.status(200).json({
      message: "Your orders have been successfully paid.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.delivered = true;
    await order.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDERESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: process.env.EMAIL_ADDERESS,
      to: order.email,
      subject: "Fake-Shop",
      html: `
          <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=, initial-scale=1.0" />
        <title></title>
        <style>
          * {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          h1 {
            background-color: gray;
            width: 100%;
            height: 100%;
            padding: 5px;
            color: #fff;
          }
          p {
            color: gray;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          a {
            border: 1px solid lightgray;
            padding: 4px;
            margin: 0 10px;
          }
        </style>
      </head>

      <body>
        <h1>👋 ${order.firstname}, Deliver update from Fake-Shop</h1>
        <p>
       We're excited to inform you that your order is on its way! and I appreciate your patience. 🚚
        </p>
        <p>Please check your personal information below</p>
          <p>👨 - ${order.firstname} ${order.lastname}</p>
          <p>🏠 - ${order.address} ${order.city}</p>
          <p> ☎️ - ${order.mobileNumber} </p>
          <p>💰 - ${Number(
            order.orderItems
              .reduce((acc, item) => acc + item.price * item.quanity, 0)
              .toFixed(2)
          )} $</p>
          <small>alwyas reach out our at www.fakeshop.com</small>
      </body>
    </html>
      `,
    };

    await transporter.sendMail(mailOption);
    return res
      .status(200)
      .json({ message: "Order has been successfully delivered." });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders = await Order.find();
    let count = await Order.countDocuments();
    if (orders && orders.length === 0) {
      return res.status(404).json({
        message: "No order has been placed as of yet.",
      });
    } else {
      return res.status(200).json({ orders, count });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "The order has been removed at this time.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
