const Order = require("../model/Order");

exports.getOrderItems = async (req, res) => {
  try {
    let orders = await Order.find();
    if (orders && orders.length === 0) {
      return res.status(404).json({
        message: "No order has been placed as of yet.",
      });
    } else {
      return res.status(200).json(orders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.newOrder = async (req, res) => {
  const { orderItems, shipping, tax, total } = req.body;
  try {
    let order = new Order({
      orderItems,
      shipping,
      tax,
      total,
      user: req.userId
    });

    order = await order.save();
    return res.status(201).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const myOrder = await Order.findById(req.params.id);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

exports.updateORderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.isPaid = true;
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
    order.isPaid = true;
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
    const order = await Order.findById(req.params.id);
    return res.status(200).json({
      message: "The order has been removed at this time.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
