const stripe = require("stripe");
const express = require("express");
const webhookRouter = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = require("stripe")(process.env.STRIPE_WEBHOOK_SECRET);

webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    console.log(`Unhandled event type ${event.type}`);

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
module.exports = webhookRouter;
