const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const Port = process.env.PORT || 3000;

const connectDb = () => {
  mongoose.set("strictQuery", false);
  const connect = mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log("database connected...");
    })
    .catch((error) => {
      console.log(error);
    });
};

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// /////////////////////////////////
/*app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});*/
//////////////////
app.use(express.json());
app.use(cookieParser());
app.use("/api", require("./routes/users"));
app.use("/post", require("./routes/post"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.listen(Port, () => {
  connectDb();
  console.log(`listening to port...${Port}`);
});
