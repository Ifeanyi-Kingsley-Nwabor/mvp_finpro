require("dotenv").config();
const jwt = require("jsonwebtoken");
const privateKey = process.env.APP_SECRET_KEY;

const jwtGenerator = (user_id) => {
  const payload = {
    // user: {
    //   id: id,
    // },
    user: id,
  };

  return jwt.sign(payload, privateKey, { expiresIn: "1hr" });
};
module.exports = jwtGenerator;
