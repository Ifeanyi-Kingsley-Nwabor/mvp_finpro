// const stripe = require("stripe");
const express = require("express");
const webhookRouter = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const { contactEmail } = require("../routes/contact");

webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const signature = request.headers["stripe-signature"];
    let event = request.body;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`).end();
      return;
    }

    // Handle the event
    let paymentIntent = null;
    //switch (event['type']) {
    switch (event.type) {
      case "payment_intent.succeeded":
        paymentIntent = event.data.object;

        // Then define and call a function to handle the event payment_intent.succeeded
        //console.log("PaymentIntent Succeeded:", intent.id);
        console.log(
          `🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`
        );

        const mail = {
          from: "Customer",
          to: "nwaborkingsley@gmail.com",
          subject: "MVP FinPro - Payment Confirmation",
          html: `<p>Name: Nwabor Kingsley</p>
                 <p>Email: nwaborkingsley@gmail.com</p>
                 <p>Message: Thank you for your payment, the service has been booked! Expect to hear from the seller soon.</p>`,
        };

        contactEmail.sendMail(mail, (error) => {
          if (error) {
            res.json({ status: "ERROR" });
          } else {
            res.json({ status: "Message Sent" });
          }
        });

        break;

      case "payment_intent.created":
        paymentIntent = event.data.object;
        //console.log("PaymentIntent created:", intent.id);
        console.log(
          `🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`
        );
        break;

      case "payment_intent.canceled":
        paymentIntent = event.data.object;
        //console.log("PaymentIntent canceled:", intent.id);
        console.log(
          `🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`
        );
        break;

      case "payment_intent.processing":
        paymentIntent = event.data.object;
        //console.log("PaymentIntent processing:", intent.id);
        console.log(
          `🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`
        );
        break;

      case "payment_intent.requires_action":
        paymentIntent = event.data.object;
        //console.log("PaymentIntent requires_action:", intent.id);
        console.log(
          `🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`
        );
        break;

      case "payment_intent.payment_failed":
        paymentIntent = event.data.object;
        const message =
          intent.last_payment_error && intent.last_payment_error.message;
        console.log("PaymentIntent Failed:", intent.id, message);
        console.log(
          `🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`
        );
        break;

      case "payment_method.attached":
        paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        // console.log(`🪙 [${event.id}] PaymentIntent (${paymentIntent.id}): ${paymentIntent.status} 🪙`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // console.log(`Unhandled event type ${event.type}`);

    // Return a 200 response to acknowledge receipt of the event
    response.json({ recieved: true });
  }
);
module.exports = webhookRouter;
