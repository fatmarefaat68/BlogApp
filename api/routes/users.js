const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  Profile,
  Logout,
} = require("./../controllers/userController");

router.post("/login", Login);

router.post("/register", Register);

router.get("/profile", Profile);

router.post("/logout", Logout);

module.exports = router;
