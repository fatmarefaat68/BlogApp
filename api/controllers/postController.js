const fs = require("fs");
const Post = require("./../models/Post");

const createPost = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  const SECRET = "a1ZJinuBSJjweig3ZSqB6Brehtjgfds0VCUge4klbSltY";
  jwt.verify(token, SECRET, {}, (err, info) => {
    if (err) console.log(err.message);
    else {
      const { title, summary, content } = req.body;
      try {
        const post = new Post({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
        post.save();
        res.status(200).json(post);
      } catch (e) {
        res.status(400).json({ message: e.message, msg2: "not created post" });
      }
    }
  });
};

const getPosts = async (req, res) => {
  try {
    const Posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(Posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("author", ["username"]);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  const SECRET = "a1ZJinuBSJjweig3ZSqB6Brehtjgfds0VCUge4klbSltY";
  jwt.verify(token, SECRET, {}, async (err, info) => {
    if (err) console.log(err.message);
    else {
      const { id, title, summary, content } = req.body;
      const post = await Post.findById(id);
      const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await post.update({
        title,
        summary,
        content,
        cover: newPath ? newPath : post.cover,
      });
      res.json(post);
    }
  });
};

module.exports = { createPost, getPosts, getPost, updatePost };
