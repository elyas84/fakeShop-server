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

exports.createReivew = async (req, res) => {
  const { rating, comment, username } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // searching thro the data
      const alreadyReviewed = product.reviews.find(
        (x) => x.user.toString() === req.userId.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json({
          message: "produtc alredy reviewed.",
        });
      }
      // creating a review
      let review = {
        username,
        rating,
        comment,
        user: req.userId,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;

      await product.save();
      return res.status(200).json({
        message: "a new review added successfully. ",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const cat = req.query.cat;
    const products = await Product.find({ category: { $in: [cat] } });
    if (products && products.length === 0) {
      return res.status(404).json({
        message:
          "Sorry! It's possible that we don't have any products in stock, please come back later.",
      });
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
