const express = require("express");
const db = require("../database/db");
const nodemailer = require("nodemailer");
const contactRouter = express.Router();
const path = require("path");
const fs = require("fs");

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mvp.finpro@gmail.com",
    pass: "Mvpfinpro10",
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  }
  // else {
  //   console.log("Ready to Send");
  //   // console.log(path.resolve(__dirname + "/something.txt"));
  // }
});

contactRouter.post("/seller", (req, res) => {
  const { file, fileValidationError } = req;
  if (!file) return res.status(400).send("Please upload a file");
  if (fileValidationError) return res.status(400).send(fileValidationError);

  const name = req.body.name;
  const buyerEmail = req.body.buyerEmail;
  const message = req.body.message;
  const sellerEmail = req.body.sellerEmail;
  console.log({
    buyerEmail,
    sellerEmail,
  });
  console.log(req.file);
  const mail = {
    from: name,
    to: sellerEmail,
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
               <p>Email: ${buyerEmail}</p>
               <p>Message: ${message}</p>`,
    attachments: [
      {
        filename: req.file.filename,
        path: req.file.path,
      },
    ],
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
      fs.unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log(`${req.file.filename} was deleted successfully`);
      });
    }
  });
});

module.exports = { contactRouter, contactEmail };
