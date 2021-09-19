const express = require("express");
const router = express.Router();
const messages = require("../utility/messages");
const connection = require("../database/mysql/connection");

router.get("/ping", (req, res, next) => {
  res.status(200).json({
    msg: messages.PING_OK,
  });
});

router.get("/connectivity", (req, res, next) => {
  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      res.status(200).json({
        msg: messages.CONNECTION_OK,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: messages.CONNECTION_FAILED,
        diagnostics: err,
        error: 500,
      });
    })
    .finally(() => {
      connection.destroyConnection(object);
    });
});


module.exports = router;
