const express = require("express");
const userServiceRouter = express.Router();
const dotenv = require("dotenv");
const helper = require("../../utility/helper");
const passwordSalter = require("../../utility/salt");
const messages = require("../../utility/messages");
const connection = require("../../database/mysql/connection");
const executor = require("../../database/mysql/executor");

userServiceRouter.post("/add", (req, res) => {
  const userid = req.body.userid;
  const pwd = req.body.password;
  const addr = req.body.st_address_ln1;
  const city = req.body.city;
  const pincode = req.body.pincode;
  const state = req.body.state;
  const country = req.body.country;
  const mobile_number = req.body.mobile_number;

  if (
    !userid ||
    !pwd ||
    !addr ||
    !city ||
    !pincode ||
    !state ||
    !country ||
    !mobile_number
  ) {
    res.status(400).json({
      msg: messages.USER.required_fields_error,
      error: 400,
    });
    return;
  }
  const { user } = require("../../models/users/user");
  var _user = new user(
    helper.getID(),
    req.body.userid,
    passwordSalter.encrypt(req.body.password),
    req.body.thirdPartySignIn ? req.body.thirdPartySignIn : "0",
    req.body.isActive ? req.body.isActive : "1",
    req.body.isSessionActive ? req.body.isSessionActive : "0",
    req.body.sessionToken ? req.body.sessionToken : null,
    req.body.st_address_ln1,
    req.body.st_address_ln2 ? req.body.st_address_ln2 : "",
    req.body.st_address_ln3 ? req.body.st_address_ln3 : "",
    req.body.city,
    req.body.pincode,
    req.body.state,
    req.body.country,
    req.body.mobile_number
  );

  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_user.getUserInsertQuery(), object)
        .then(() => {
          res.status(201).json({
            msg: messages.USER.created,
          });
        })
        .catch((err) => {
          res.status(500).json({
            msg: messages.OPERATION_FAILED,
            diagnostics: err,
            error: 500,
          });
        })
        .finally(() => {
          connection.destroyConnection(object);
        });
    })
    .catch((err) => {
      res.status(500).json({
        msg: messages.CONNECTION_FAILED,
        diagnostics: err,
        error: 500,
      });
    });
});

module.exports = userServiceRouter;
