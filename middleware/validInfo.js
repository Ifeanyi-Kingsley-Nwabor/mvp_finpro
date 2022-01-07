module.exports = (req, res, next) => {
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

  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  };

  if (req.path === "/auth/register") {
    console.log(!email.length);
    if (
      ![
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
      ].every(Boolean)
    ) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/auth/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
};
