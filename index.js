// const express = require("express");
// // const router = express.Router();
// // const app = express();
// const cors = require("cors");
// const axios = require("axios");
// const dotenv = require("dotenv");
// const router = require("./routes/index");
// require("dotenv").config();

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import axios from "axios";
// import { registerUser } from "./controllers/Users.js";

const port = process.env.PORT || 5050;

dotenv.config();
const app = express();

//enabling cors
app.use(cors());

//Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//add router in express app
app.use("/", router);

//POST route
router.post("/post", async (req, res) => {
  ////Destructuring response token and input field value from request body
  const { token, inputVal } = req.body;

  try {
    // Sending secret key and response token to Google Recaptcha API for authentication.
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    );

    // Check response status and send back to the client-side
    if (response.data.success) {
      res.status(200).json({ msg: "Human" });
    } else {
      res.status(200).json({ msg: "Robot" });
    }
  } catch (error) {
    // Handle any errors that occur during the reCAPTCHA verification process
    console.error(error);
    res.status(500).send("Error verifying reCAPTCHA");
  }
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
