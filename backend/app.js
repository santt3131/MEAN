//importamos el express
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const Post = require("./models/post");

mongoose.connect("mongodb+srv://santt31:" + process.env.MONGO_ATLAS_PW + "@cluster0.oreks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//configuro mi api
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

//exportamos la aplicacion
module.exports = app;
