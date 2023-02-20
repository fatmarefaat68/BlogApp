const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cookie = require("cookie-parser");
const dotenv = require("dotenv").config();

const Register = async (req, res) => {
  // console.log("gooing to register");
  const { username, password } = req.body;
  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new users({ username, password: hashedPassword });
    user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username });
    if (user && bcrypt.compare(user.password, password)) {
      jwt.sign(
        { username, id: user._id },
        "a1ZJinuBSJjweig3ZSqB6Brehtjgfds0VCUge4klbSltY",
        {},
        (err, token) => {
          if (err) console.log(err.message);
          res.cookie("Token", token).status(201).json({
            id: user._id,
            username,
          });
        }
      );
    } else {
      res.send("invalid name or password");
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const Profile = async (req, res) => {
  const { token } = req.cookies;
  const SECRET = "a1ZJinuBSJjweig3ZSqB6Brehtjgfds0VCUge4klbSltY";
  jwt.verify(token, SECRET, {}, (err, info) => {
    if (err) console.log(err.message, "i am error in token");
    else res.json(info);
  });
};

const Logout = async (req, res) => {
  res.cookie("Token", "").json("ok");
};

module.exports = { Register, Login, Profile, Logout };
