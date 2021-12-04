const express = require("express");
const db = require("../database/db");
const checkoutRouter = express.Router();
const validator = require("validator");
const { default: Stripe } = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

checkoutRouter.post("/create-payment-intent", async (req, res, next) => {
  const { currency, paymentMethodType, amount } = req.body;
  console.log(currency, paymentMethodType);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(400).json({ error: { message: e.message } });
  }
});

checkoutRouter.get("/config", (req, res, next) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

module.exports = checkoutRouter;
