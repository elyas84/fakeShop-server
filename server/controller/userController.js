const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//@desc update user info
//@route /update/id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (req.userId !== user._id.toString()) {
      return res.status(403).json({
        message: "This account cannot be updated!",
      });
    }

    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;

    /**
     * hash pass
     */

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    await user.save();
    const { password, ...info } = user._doc;
    return res.status(200).json({
      message: "Your profile has been successfully updated.",
      info,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//@desc delete user
//@route /delete/id

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "We're not sure if this account exists in our database!",
      });
    } else {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message:
          "Right now, This account has been deleted. Although we are sorry to split from you, you are always welcome!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//@desc get user  profile
//@route /profile/id

exports.userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "We apologize; an error occurred on our end.",
      });
    }
    if (req.userId !== user._id.toString()) {
      return res.status(403).json({
        message: "You are unable to access this account.",
      });
    }

    const { password, ...info } = user._doc;
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//@desc get all users
//@route /users

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    let count = await User.countDocuments({ role: "user" });

    if (users && users.length === 0) {
      return res.status(404).json({
        message: "As of yet, no users have been created.",
        count,
      });
    } else {
      return res.status(200).json({ users, count });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
