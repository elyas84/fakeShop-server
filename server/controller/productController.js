const Product = require("../model/Product");
exports.getProducts = async (req, res) => {
  try {
    let products;
    const byBrand = req.query.byBrand;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    if (byBrand) {
      products = await Product.find({
        productName: { $regex: byBrand, $options: "i" },
      });
      return res.status(200).json(products);
    } else if (minPrice || maxPrice) {
      products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice },
      });
      return res.status(200).json(products);
    } else {
      products = await Product.find();
      count = await Product.countDocuments();
      if (products && products.length === 0) {
        return res.status(404).json({
          message:
            "Sorry! It's possible that we don't have any products in stock, please come back later.",
        });
      }
      return res.status(200).json({ products, count });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.newProject = async (req, res) => {
  const { productName } = req.body;
  try {
    let product = await Product.findOne({ productName });
    if (product) {
      return res.status(400).json({
        message: "No two products can have the same title.",
      });
    }
    product = new Product(req.body);

    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message:
          "Sorry! It's possible that we don't have any products in stock, please come back later.",
      });
    } else {
      return res.status(200).json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    product.productName = req.body.productName || product.productName;
    product.description = req.body.description || product.description;
    product.productImage = req.body.productImage || product.productImage;
    product.price = req.body.price || product.price;
    product.information = req.body.information || product.information;
    product.inStock = req.body.inStock || product.inStock;
    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "The product has been removed at this time.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// create a comment
exports.newComment = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    const userComment = {
      rating,
      comment,
      user: req.userId,
    };
    product.comments.push(userComment);
    await product.save();
    res.status(200).json({ message: "Comment added successfully. " });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
