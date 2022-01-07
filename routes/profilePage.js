const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const db = require("../database/db");

router.get("/", authorize, async (req, res, next) => {
  try {
    const user = await db.query("SELECT first_name FROM users WHERE id = $1", [
      req.user,
    ]);
    // console.log(req.user);
    //it would be req.user if you change your payload to this:

    //   function jwtGenerator(user_id) {
    //   const payload = {
    //     user: user_id
    //   };
    res.json(user.rows[0]);
  } catch (err) {
    // console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
