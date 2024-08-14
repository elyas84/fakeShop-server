const mongoose = require("mongoose");
const commentsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productImage: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Number,
      default: 0,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    comments: [commentsSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
