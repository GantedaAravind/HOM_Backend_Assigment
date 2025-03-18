"use strict";

var jwt = require("jsonwebtoken");
var SECRET_KEY = process.env.JWT_SECRET;
var authenticate = function authenticate(req, res, next) {
  var token = req.cookies.auth_token;
  if (!token) return res.status(401).json({
    message: "Unauthorized"
  });
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) return res.status(403).json({
      message: "Invalid token"
    });
    req.userId = decoded.userId;
    next();
  });
};
module.exports = authenticate;