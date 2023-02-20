const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
} = require("./../controllers/postController");

router.post("/", uploadMiddleware.single("file"), createPost);

router.get("/", getPosts);

router.get("/:id", getPost);

//should have id hereee
router.put("/", uploadMiddleware.single("file"), updatePost);

module.exports = router;
