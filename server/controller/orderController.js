const Order = require("../model/Order");
const Product = require("../model/Product");
exports.getOrderItems = async (req, res) => {
  let orders;
  count = await Order.countDocuments();
  try {
    let paid = req.query.paid;
    let delivered = req.query.delivered;
    let paidAndDelivered = req.query.paidAndDelivered;
    if (paid) {
      count = await Order.countDocuments({ isPaid: true });
      orders = await Order.find({ isPaid: true });
      return res.status(200).json({ orders, count });
    } else if (paidAndDelivered) {
      orders = await Order.find({
        $and: [{ delivered: true }, { isPaid: true }],
      });
      count = await Order.countDocuments({ delivered: true }, { isPaid: true });
      return res.status(200).json({ orders, count });
    } else if (delivered) {
      count = await Order.countDocuments({ delivered: true });
      orders = await Order.find({ delivered: true });
      return res.status(200).json({ orders, count });
    } else {
      orders = await Order.find().populate("user", "email username");
      count = await Order.countDocuments();
      if (orders && orders.length === 0) {
        return res.status(404).json({
          message: "No order has been placed as of yet.",
          count,
        });
      } else {
        return res.status(200).json({ orders, count });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.newOrder = async (req, res) => {
  const {
    orderItems,
    firstname,
    lastname,
    email,
    mobileNumber,
    address,
    city,
  } = req.body;
  const totalPriceForItems = orderItems.map((data) => {
    return data.price * data.quanity;
  });
  let sum = 0;
  totalPriceForItems.reduce(function (accumulator, currentValue) {
    return (sum = accumulator + currentValue);
  }, 0);

  try {
    let order = new Order({
      orderItems,
      total: sum + 5.5 + 4.99,
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
    console.log(error.message);
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

exports.updateORderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.isPaid = true;
    await order.save();
    return res.status(201).json({
      message: "Your orders have been successfully paid.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateORderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.delivered = true;
    await order.save();
    return res.status(201).json({
      message: "Your orders have been successfully delevired.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders = await Order.find();
    if (orders && orders.length === 0) {
      return res.status(404).json({
        message: "No order has been placed as of yet.",
      });
    } else {
      return res.status(200).json(order);
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
