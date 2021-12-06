const express = require("express");
const db = require("../database/db");
const nodemailer = require("nodemailer");
const contactRouter = express.Router();

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alexinamclanaghan574@gmail.com",
    pass: "Mvpfinpro",
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

contactRouter.post("/seller", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: "alexinamclanaghan574@gmail.com",
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

module.exports = contactRouter;
