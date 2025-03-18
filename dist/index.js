"use strict";

var express = require("express");
var cookieParser = require("cookie-parser");
var connectDB = require("./config/db");
var authRoutes = require("./routes/auth");
var taskRoutes = require("./routes/task");
require("dotenv").config();
var app = express();
var PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.get("/", function (req, res) {
  res.send("Welcome To Task Management API");
});
// Connect to MongoDB
connectDB().then(function () {
  app.listen(PORT, function () {
    return console.log("Server running on port ".concat(PORT));
  });
});