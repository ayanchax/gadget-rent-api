const express = require("express");
const authenticationServiceRouter = express.Router();
const dotenv = require("dotenv");
const helper = require("../../../utility/helper");
const passwordSalter = require("../../../utility/salt");
const messages = require("../../../utility/messages");
const connection = require("../../../database/mysql/connection");
const executor = require("../../../database/mysql/executor");
dotenv.config();

authenticationServiceRouter.post("/", (req, res) => {
  const userid = req.body?.userid?.trim();
  const pwd = req.body?.password;
  if (!userid || !pwd) {
    res.status(400).json({
      msg: messages.USER.authentication_error,
      authenticated: false,
      error: 400,
    });
    return;
  }
  let errors = [];
  errors.push(messages.USER.authentication_error);
  if (!helper.isValidEmail(userid)) {
    errors.push(messages.USER.user_id_error);
  }
  if (!passwordSalter.isValidPassword(pwd)) {
    errors.push(messages.USER.password_error);
  }

  if (errors.length > 1) {
    res.status(400).json({
      msg: errors,
      authenticated: false,
      error: 400,
    });
    return;
  }
  if (errors.length === 1) errors.splice(0, 1);
  const {
    auth,
  } = require("../../../models/users/authentication/authentication");
  var _auth = new auth(userid, pwd);

  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_auth.getUserEncryptedPasswordByUserId(), object)
        .then((result) => {
          const isAuthenticated = () => {
            if (result.length === 0) return false;
            return (
              result[0].dataCount === 1 &&
              result[0].isActive &&
              result[0].isActive.lastIndexOf(1) !== -1 &&
              passwordSalter.decrypt(result[0].password, result[0].objid) === _auth.password
            );
          };
          if (isAuthenticated()) {
            res.status(200).json({
              msg: messages.USER.authentication_done,
              authenticated: true,
              token: [
                {
                  _gid: result[0].objid,
                  _gsession: helper.getID(),
                },
              ],
              _gmetaData: [
                {
                  name: result[0].name,
                  address: [
                    {
                      addr_1: result[0].st_address_ln1,
                      addr_2: result[0].st_address_ln2,
                      addr_3: result[0].st_address_ln3,
                    },
                  ],
                  city: result[0].city,
                  pincode: result[0].pincode,
                  state: result[0].state,
                  country: result[0].country,
                  mobile_number: result[0].mobile_number,
                },
              ],
            });
          } else {
            res.status(404).json({
              msg: messages.USER.authentication_error_message,
              authenticated: false,
              error: 404,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            msg: messages.OPERATION_FAILED,
            diagnostics: err,
            authenticated: false,
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
        authenticated: false,
        error: 500,
      });
    });
});

module.exports = authenticationServiceRouter;
