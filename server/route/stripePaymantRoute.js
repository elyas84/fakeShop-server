const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIP_SECRET);
router.post("/create-checkout-session", async (req, res) => {
  const line_items = req.body.orders.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
          images: [item.image],
          metadata: {
            id: item._id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: req.body.orders.reduce((acc, item) => acc + item.quanity, 0),
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: process.env.DEV_ENV + "/success",
    cancel_url: process.env.DEV_ENV + "/cart",
  });
  return res.json({ url: session.url });
});

module.exports = router;
