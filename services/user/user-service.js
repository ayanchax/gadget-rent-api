const express = require("express");
const userServiceRouter = express.Router();
const dotenv = require("dotenv");
const helper = require("../../utility/helper");
const passwordSalter = require("../../utility/salt");
const messages = require("../../utility/messages");
const connection = require("../../database/mysql/connection");
const executor = require("../../database/mysql/executor");
dotenv.config();
// Add User
userServiceRouter.post("/add", (req, res) => {
  const userid = req.body?.userid?.trim();
  const pwd = req.body?.password;
  const name = req.body?.name?.trim();
  const addr = req.body?.st_address_ln1?.trim();
  const addr_2 = req.body?.st_address_ln2?.trim();
  const addr_3 = req.body?.st_address_ln3?.trim();
  const city = req.body?.city?.trim();
  const pincode = req.body?.pincode?.trim();
  const state = req.body?.state?.trim();
  const country = req.body?.country?.trim();
  const mobile_number = req.body?.mobile_number?.trim();

  if (
    !userid ||
    !pwd ||
    !name ||
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
  let errors = [];
  if (!helper.isValidEmail(userid)) {
    errors.push(messages.USER.user_id_error);
  }
  if (!passwordSalter.isValidPassword(pwd)) {
    errors.push(messages.USER.password_error);
  }
  if (!helper.isValidZIP(pincode)) {
    errors.push(messages.USER.pincode_error);
  }
  if (!helper.isValidPhoneNumber(mobile_number)) {
    errors.push(messages.USER.mobile_number_error);
  }
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 400,
    });
    return;
  }
  const { user } = require("../../models/users/user");
  const objectID = helper.getID();
  var _user = new user(
    objectID,
    userid,
    passwordSalter.encrypt(pwd),
    req.body?.thirdPartySignIn ? req.body?.thirdPartySignIn : "0",
    req.body?.isActive ? req.body?.isActive : "1",
    name,
    addr,
    addr_2 ? addr_2 : "",
    addr_3 ? addr_3 : "",
    city,
    pincode,
    state,
    country,
    mobile_number,
    req.body?.isAccountVerified ? req.body?.isAccountVerified : "0",
    req.body?.accountVerificationLink
      ? req.body?.accountVerificationLink
      : process.env.ACCOUNT_VERIFICATION_LINK + objectID
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

//update personal detail by id
userServiceRouter.put("/update/personal/:userid", (req, res) => {
  const objectid = req.params?.userid?.trim();
  if (!objectid) {
    res.status(400).json({
      msg: messages.USER.object_missing_update_error,
      error: 400,
    });
    return;
  }
  const name = req.body?.name?.trim();
  const addr = req.body?.st_address_ln1?.trim();
  const addr_2 = req.body?.st_address_ln2?.trim();
  const addr_3 = req.body?.st_address_ln3?.trim();
  const city = req.body?.city?.trim();
  const pincode = req.body?.pincode?.trim();
  const state = req.body?.state?.trim();
  const country = req.body?.country?.trim();
  const mobile_number = req.body?.mobile_number?.trim();

  if (!name || !addr || !city || !pincode || !state || !country || !mobile_number) {
    res.status(400).json({
      msg: messages.USER.required_fields_error,
      error: 400,
    });
    return;
  }
  let errors = [];
  if (!helper.isValidZIP(pincode)) {
    errors.push(messages.USER.pincode_error);
  }
  if (!helper.isValidPhoneNumber(mobile_number)) {
    errors.push(messages.USER.mobile_number_error);
  }
  if (errors.length > 0) {
    res.status(400).json({
      msg: errors,
      error: 400,
    });
    return;
  }

  const { user } = require("../../models/users/user");
  var _user = new user(
    objectid,
    null,
    null,
    null,
    null,
    name,
    addr,
    addr_2 ? addr_2 : "",
    addr_3 ? addr_3 : "",
    city,
    pincode,
    state,
    country,
    mobile_number,
    null,
    null
  );

  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_user.getFindUserCountByIdQuery(), object)
        .then((result) => {
          if (result[0].dataCount === 1) {
            executor
              .executeQuery(_user.getUpdateUserPersonalDetailsQuery(), object)
              .then(() => {
                res.status(200).json({
                  msg: messages.USER.updated,
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
          } else {
            res.status(404).json({
              msg: messages.USER.not_found_error,
              error: 404,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            msg: messages.OPERATION_FAILED,
            diagnostics: err,
            error: 500,
          });
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

// generate account verification link by id
userServiceRouter.patch(
  "/generate/account/verification/:userid",
  (req, res) => {
    const objectid = req.params?.userid?.trim();
    if (!objectid) {
      res.status(400).json({
        msg: messages.USER.object_missing_update_error,
        error: 400,
      });
      return;
    }

    const { user } = require("../../models/users/user");
    var _user = new user(
      objectid,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      process.env.ACCOUNT_VERIFICATION_LINK + objectid
    );

    let object = null;
    connection
      .createConnection()
      .then((connection_object) => {
        object = connection_object;
        executor
          .executeQuery(_user.getUserAccountVerificationLinkByIdQuery(), object)
          .then((result) => {
            if (result[0].dataCount === 1) {
              if (
                result[0].accountVerificationLink !== "" &&
                result[0].accountVerificationLink !== null
              ) {
                res.status(409).json({
                  msg: messages.USER.verification_link_exists,
                  error: 409,
                });
              } else {
                executor
                  .executeQuery(_user.getGenerateUserVerificationLink(), object)
                  .then(() => {
                    res.status(200).json({
                      msg: messages.USER.verification_link_generated,
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
              }
            } else {
              res.status(404).json({
                msg: messages.USER.not_found_error,
                error: 404,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              msg: messages.OPERATION_FAILED,
              diagnostics: err,
              error: 500,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          msg: messages.CONNECTION_FAILED,
          diagnostics: err,
          error: 500,
        });
      });
  }
);
// verify account by clicking verify account from the interface.
userServiceRouter.patch("/verify/account/:userid", (req, res) => {
  const objectid = req.params?.userid?.trim();
  if (!objectid) {
    res.status(400).json({
      msg: messages.USER.object_missing_update_error,
      error: 400,
    });
    return;
  }

  const { user } = require("../../models/users/user");
  var _user = new user(
    objectid,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null
  );

  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_user.getUserAccountVerificationLinkByIdQuery(), object)
        .then((result) => {
          if (result[0].dataCount === 1) {
            if (
              result[0].accountVerificationLink !== "" &&
              result[0].accountVerificationLink !== null
            ) {
              if (
                result[0].isAccountVerified &&
                result[0].isAccountVerified.lastIndexOf(1) !== -1
              ) {
                res.status(409).json({
                  msg: messages.USER.already_verified,
                  error: 409,
                });
              } else {
                executor
                  .executeQuery(
                    _user.getUpdateAccountVerificationFlagQuery(),
                    object
                  )
                  .then(() => {
                    res.status(200).json({
                      msg: messages.USER.account_verified,
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
              }
            } else {
              res.status(404).json({
                msg: messages.USER.no_verification_link,
                error: 404,
              });
            }
          } else {
            res.status(404).json({
              msg: messages.USER.not_found_error,
              error: 404,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            msg: messages.OPERATION_FAILED,
            diagnostics: err,
            error: 500,
          });
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

// change password
userServiceRouter.patch("/change/password/:userid", (req, res) => {
  const objectid = req.params?.userid?.trim();
  const oldPassword = req.body?.oldPassword;
  const newPassword = req.body?.newPassword;
  const confirmNewPassword = req.body?.confirmNewPassword;
  if (!objectid || !oldPassword || !newPassword || !confirmNewPassword) {
    res.status(400).json({
      msg: messages.USER.required_fields_for_password_change_error,
      error: 400,
    });
    return;
  }
  if (newPassword !== confirmNewPassword) {
    res.status(400).json({
      msg: messages.USER.password_mismatch_error,
      error: 400,
    });
    return;
  }
  if (!passwordSalter.isValidPassword(newPassword)) {
    res.status(400).json({
      msg: messages.USER.password_error,
      error: 400,
    });
    return;
  }
  const { user } = require("../../models/users/user");
  var _user = new user(
    objectid,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_user.getFindUserPasswordByIdQuery(), object)
        .then((result) => {
          if (result[0].dataCount === 1) {
          let existingEncryptedPassword=result[0].password 
          let decryptedExistingPassword= passwordSalter.decrypt(existingEncryptedPassword)
           if(decryptedExistingPassword!==oldPassword) {
            res.status(404).json({
              msg: messages.USER.password_incorrect,
              error: 404,
            });
             return;
           }
            _user.password = passwordSalter.encrypt(newPassword);
            executor
              .executeQuery(
                _user.getUpdatePasswordQuery(),
                object
              )
              .then(() => {
                res.status(200).json({
                  msg: messages.USER.password_changed,
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
          } else {
            res.status(404).json({
              msg: messages.USER.password_change_error,
              error: 404,
            });
          }
        })
        .catch((err) => {
          
          res.status(500).json({
            msg: messages.OPERATION_FAILED,
            diagnostics: err,
            error: 500,
          });
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

// get active user information by id
userServiceRouter.get("/:userid",(req,res)=>{
  const objectid = req.params?.userid?.trim();
  if (!objectid) {
    res.status(400).json({
      msg: messages.SUPPLY_VALID_IDENTIFIER,
      error: 400,
    });
    return;
  }
  const { user } = require("../../models/users/user");
  var _user = new user(
    objectid,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_user.getFindUserCountByIdQuery(), object)
        .then((result) => {
          if (result[0].dataCount === 1) {
            executor
              .executeQuery(_user.getActiveUserByIdQuery(), object)
              .then((result) => {
                result[0].isAccountVerified=  result[0].isAccountVerified &&
                result[0].isAccountVerified.lastIndexOf(1) !== -1 ? true: false
                res.status(200).json(result[0]);
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
          } else {
            res.status(404).json({
              msg: messages.USER.no_user_found,
              error: 404,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            msg: messages.OPERATION_FAILED,
            diagnostics: err,
            error: 500,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        msg: messages.CONNECTION_FAILED,
        diagnostics: err,
        error: 500,
      });
    });

})
// get inactive user by id
// delete user by id
// get all users no filter
module.exports = userServiceRouter;
