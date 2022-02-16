const express = require("express");
const db = require("../database/db");
const multer = require("multer");
// const { upload } = require("../utils/fileUploader");

const allUsers = (req, res, next) => {
  db.query(`SELECT * FROM users ORDER BY id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
};

const oneUser = async (req, res, next) => {
  const { id } = req.params;
  const user = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };
  await db
    .query(user)
    .then((data) => res.status(200).json(data.rows))
    .catch(next);
};

// const oneUser = async (req, res, next) => {
//   const { id } = req.params;
//   const user = {
//     text: `
//   SELECT
//     id,
//     first_name,
//     last_name,
//     image_user,
//     type,
//     business_name,
//     email,
//     password,
//     phone_number,
//     address,
//     city,
//     state,
//     country,
//     about,
//     FROM users
//     WHERE id=$1`,
//     values: [id],
//   };
//   await db
//     .query(user)
//     .then((data) => res.status(200).json(data.rows))
//     .catch(next);
// };

const createUser = (req, res, next) => {
  const {
    first_name,
    last_name,
    // image_user,
    // type,
    // business_name,
    email,
    password,
    // phone_number,
    // address,
    // city,
    // state,
    // country,
    // about,
  } = req.body;

  const newUser = {
    text: `INSERT INTO users (first_name, last_name, image_user, type, business_name, email, password, phone_number, address, city, state, country, about)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
        `,
    values: [
      first_name,
      last_name,
      // image_user,
      // type,
      // business_name,
      email,
      password,
      // phone_number,
      // address,
      // city,
      // state,
      // country,
      // about,
    ],
  };
  db.query(newUser)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

// const uploadImage = (req, res, next) => {
//   const { image_user } = req.body;
//   const { id } = req.params;

//   const imagePath = req.file.path;

//   const { file, fileValidationError } = req;
//   if (!file) return res.status(400).send("Please upload a file");
//   if (fileValidationError) return res.status(400).send(fileValidationError);

//   upload2(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     return res.status(200).send(imagePath);
//     // return res.status(200).send(req.file);
//   });

//   const uploadProfileImage = {
//     text: `SET image_user=$1
//     WHERE id=$2
//     RETURNING *`,
//     VALUES: [image_user, id],
//   };

//   db.query(uploadProfileImage)
//     .then((data) => res.status(201).json(data.rows))
//     .catch(next);
// };

const editUser = (req, res, next) => {
  const {
    first_name,
    last_name,
    // image_user,
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
  const { id } = req.params;
  console.log("gaga " + first_name);

  const updateUser = {
    text: `
        UPDATE users
         SET first_name=$1, last_name=$2, type=$3, business_name=$4, email=$5, password=$6, phone_number=$7, address=$8, city=$9, state=$10, country=$11, about=$12
        WHERE id=$13
        RETURNING *
        `,
    // text: `
    //     UPDATE users
    //     // SET first_name=$1, last_name=$2, image_user=$3, type=$4, business_name=$5, email=$6, password=$7, phone_number=$8, address=$9, city=$10, state=$11, country=$12, about=$13
    //     WHERE id=$14
    //     RETURNING *
    //     `,
    values: [
      first_name,
      last_name,
      // image_user,
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
      id,
    ],
  };
  db.query(updateUser)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const listMyServices = async (req, res, next) => {
  const { id } = req.params;
  const getMyServices = {
    text: `
      SELECT 
      u.id,
      s.id,
         
          s.title,
          s.image,
          s.image_2,
          s.image_3,
          s.image_4,
          s.category,
          s.price,
          s.description
      FROM users AS u
      JOIN services AS s
      ON s.user_id = u.id
      WHERE u.id = $1
      `,
    values: [id],
  };

  //   try {
  //     const { rows: getMyServices } = await db.query(getMyServices);
  //     console.log("whadup" + rows);

  //     const result = {
  //       ...getMyServices["0"],
  //     };
  //     res.json(result);
  //   } catch (e) {
  //     res.status(500).send(e.message);
  //   }
  // };

  await db
    .query(getMyServices)
    .then((data) => {
      // console.log("stringify" + JSON.stringify(data));
      // console.log("stringify WITH ROWS" + JSON.stringify(data.rows));

      res.status(201).json(data.rows);
    })
    .catch(next);
};

const deleteUser = (req, res, next) => {
  const { id } = req.params;
  const deleteUser = {
    text: `
        DELETE FROM users
        WHERE id=$1
        RETURNING *`,
    values: [id],
  };
  db.query(deleteUser)
    .then((data) => {
      if (!data.rows.length) {
        res
          .status(404)
          .send(`The requested user does not exist or has been deleted.`);
      } else {
        res.status(200).json(data.rows);
      }
    })
    .catch(next);
};

module.exports = {
  allUsers,
  oneUser,
  createUser,
  editUser,
  // uploadImage,
  listMyServices,
  deleteUser,
};
