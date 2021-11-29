require("dotenv").config({ path: "./.env" });
const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const webhookSecret = require("stripe")(process.env.STRIPE_WEBHOOK_SECRET);

const servicesRouter = require("./routes/services");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const checkoutRouter = require("./routes/checkout");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(process.env.STATIC_DIR));

app.use(helmet());
app.use(cors());

app.use("/services", servicesRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/checkout", checkoutRouter);

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
