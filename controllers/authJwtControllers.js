const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.APP_SECRET_KEY;

const express = require("express");
const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const createUser = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      image_user,
      type,
      business_name,
      email,
      password,
      phone_number,
      address,
      city,
      state,
      country,
      about,
    } = req.body;
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).json("invalid request");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = {
      text: `INSERT INTO users (first_name, last_name, image_user, type, business_name, email, password, phone_number, address, city, state, country, about)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
          RETURNING *
          `,
      values: [
        first_name,
        last_name,
        image_user,
        type,
        business_name,
        email,
        bcryptPassword,
        phone_number,
        address,
        city,
        state,
        country,
        about,
      ],
    };
    await db
      .query(newUser)
      .then((data) => {
        console.log(data);

        // THIS
        // const token = jwtGenerator(newUser.rows[0].id);
        // return res.status(201).json({ token });

        // OR THIS
        // const token = jwtGenerator(newUser.values[5]);
        // return res.status(201).json({ token });

        // OR THIS*
        const usertoken = jwt.sign(newUser.values[5], privateKey);
        return res.status(201).json({ token: usertoken });

        // OR THIS
        // const token = jwt.sign(newUser.values[5], privateKey);
        // return res.status(201).json({ token });

        // OR THIS
        // const usertoken = jwt.sign(newUser.values[5], privateKey, {
        //   expiresIn: "1hr",
        // });
        // return res.status(201).json({ token: usertoken });

        // res.status(201).json(data.rows);
      })
      .catch(next);

    // res.json(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Email or Password is incorrect");
    }

    const validPassword = await bcrypt.compare(
      password,
      // user.rows[0].user_password
      user.rows[0].password
    );
    if (!validPassword) {
      return res.status(401).json("Email or Password is incorrect");
    }

    const usertoken = jwt.sign(user.rows[0].id, privateKey);
    return res.status(201).json({ token: usertoken });

    // const jwtToken = jwtGenerator(user.rows[0].user_id);
    // return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const verifyUser = async (req, res, next) => {
  try {
    res.json(true);
  } catch (err) {
    // console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyUser,
};
