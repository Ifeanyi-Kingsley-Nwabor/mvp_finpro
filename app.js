require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const stripeSecretKey = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripePublicKey = require("stripe")(process.env.STRIPE_PUBLISHABLE_KEY);
const webhookSecret = require("stripe")(process.env.STRIPE_WEBHOOK_SECRET);

const multer = require("multer");
const fs = require("fs");
const db = require("./database/db");
const upload = require("./utils/fileUploader");

const servicesRouter = require("./routes/services");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const checkoutRouter = require("./routes/checkout");
const contactRouter = require("./routes/contact");
const webhookRouter = require("./routes/webhook_server");
const authRouter = require("./routes/authJwt");
const profileRouter = require("./routes/profilePage");

app.use(cors());
app.use(logger("dev"));
// app.use(express.json());

app.use((req, res, next) => {
  console.log(req.originalUrl);
  if (req.originalUrl.startsWith("/payment/webhook")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

app.use("/services", servicesRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/checkout", checkoutRouter);
app.use("/payment", webhookRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.use("/contact", upload.single("file"), contactRouter);

app.get("/", (req, res, next) => {
  res.json("welcome to mvp_finpro");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

app.all("*", (req, res) => {
  res.redirect("/");
});

// app.use((err, req, res, next) => {
//   console.log(err.message);
//   res.status(500).send("Invalid request!");
// });

module.exports = app;
