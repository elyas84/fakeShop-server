const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

//@desc Register
//@route /register

exports.newUser = async (req, res) => {
  const { username, email, password, role } = req.body;
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
      role,
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
      html: `
          <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=, initial-scale=1.0" />
        <title></title>
        <style>
          * {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          h1 {
            background-color: gray;
            width: 100%;
            height: 100%;
            padding: 5px;
            color: #fff;
          }
          p {
            color: gray;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          a {
            border: 1px solid lightgray;
            padding: 4px;
            margin: 0 10px;
          }
        </style>
      </head>

      <body>
        <h1>👋 ${username}, welcome to Fake-Shop 🤩</h1>
        <p>
          Please confirm your email by cklicking on the following link ➡️
          <a href="http://localhost:5000/api/auth/confirm/${confirmationToken}"
            >Confirm your Email
          </a>
          ⬅️
        </p>
      </body>
    </html>
      
      
      `,
    };

    await transporter.sendMail(mailOption);
    res.status(201).json({
      message:
        "The user signed up. To validate your account, please check your email.",
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
      message: "Congratulations! Your email has been successfully confirmed.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//@desc Login
//@route /login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "wrong login information; try again!",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "wrong login information; try again!",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    const { password, ...info } = user._doc;
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 1h,
      })
      .status(200)
      .json(info);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//@desc Logout
//@route /logout

exports.logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      message: "The user has successfully signed out.",
    });
};
