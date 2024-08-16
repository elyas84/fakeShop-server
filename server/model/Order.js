const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [
      {
        productName: { type: String, required: true },
        quanity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    delivered: {
      type: Boolean,
      default: false,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
      default: 4.99,
    },
    tax: {
      type: Number,
      required: true,
      default: 5.5,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
