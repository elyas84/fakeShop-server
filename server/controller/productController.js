const Product = require("../model/Product");
exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find();
    count = await Product.countDocuments();
    if (products && products.length === 0) {
      return res.status(404).json({
        message:
          "Sorry! It's possible that we don't have any products in stock, please come back later.",
      });
    } else {
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
    product.category = req.body.category || product.category;
    await product.save();
    return res
      .status(200)
      .json({ message: "The product has been succefully updated.", product });
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
  const { rating, comment, username, email } = req.body;
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
        email,
        user: req.userId,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = Math.floor(
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length
      ).toFixed(2);

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

exports.deleteAReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.reviews.pop();
    await product.save();
    return res.status(200).json({
      message: "a new review deleted successfully. ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Filtering

exports.getProductByCategory = async (req, res) => {
  try {
    const cat = req.query.cat;
    const products = await Product.find({ category: { $in: [cat] } });
    if (products && products.length === 0) {
      return res.status(404).json({
        message:
          "Sorry! It's possible that we don't have any products in stock, please come back later.",
      });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductByRating = async (req, res) => {
  try {
    const ratio = req.query.ratio;
    // let products = await Product.find({ category: { $in: [cat] } });
    let products = await Product.find({ rating: ratio });
    if (products && products.length === 0) {
      return res.status(404).json({
        message:
          "We apologize; it's possible that the customer hasn't commented on this product yet. ",
      });
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductsByPriceRange = async (req, res) => {
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  try {
    let products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    if (products && products.length === 0) {
      return res.status(404).json({
        message:
          "We are sorry, but it's possible that at this time there are no matches for your search.",
      });
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductsBySearchKeywords = async (req, res) => {
  try {
    const search = req.query.search;
    let products = await Product.find({
      productName: { $regex: search, $options: "i" },
    });
    if (products && products.length === 0) {
      return res.status(404).json({
        message: "We apologize, but nothing matches your search!",
      });
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductByCategoryAndPriceRange = async (req, res) => {
  const cat = req.query.cat;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  try {
    const products = await Product.find({
      category: cat,
      price: { $gte: minPrice, $lte: maxPrice },
    });
    if (products && products.length === 0) {
      return res.status(404).json({
        message: "We apologize, but nothing matches your search!",
      });
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProductByCategoryAndRatio = async (req, res) => {
  try {
    const ratio = req.query.ratio;
    const cat = req.query.cat;
    // let products = await Product.find({ category: { $in: [cat] } });
    let products = await Product.find({ category: cat, rating: ratio });
    if (products && products.length === 0) {
      return res.status(404).json({
        message:
          "We apologize; it's possible that the customer hasn't commented on this product yet. ",
      });
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};