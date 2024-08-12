const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

//@POST Rgister
//@route /register

exports.newUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  try {
    let user = await User.findOne({ email });
    let registerName = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: "Email is taken. please try with different one.",
      });
    } else if (registerName) {
      return res.status(400).json({
        message: "username is taken, please try with different one.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({
      username,
      email,
      isAdmin,
      password: hash,
    });

    // email confirmation token
    let confirmationToken = jwt.sign(
      { email: user.email },

      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    user.confirmationToken = confirmationToken;
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDERESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: process.env.EMAIL_ADDERESS,
      to: user.email,
      subject: "Email confirmation from Fake-Shop",
      html: `<h2>Dear user welcome to Fake-Shop</h2>
            <p>Please confirm your email by cklicking on the following link
            <a href="http://localhost:5000/api/auth/confirm/${confirmationToken}">Confirm Email</a></p>`,
    };

    await transporter.sendMail(mailOption);
    res.status(201).json({
      message:
        "User registered. Please check your email to confirm your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getEmailConfirmation = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({
        error: "Invalid token or user does not exist",
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        error: "Email already confirmed.",
      });
    }
    user.isVerified = true;
    user.confirmationToken = null;
    await user.save();
    return res.status(201).json({
      message: "Congrats! your email now is confirmed successefuly!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
