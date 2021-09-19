const mysql = require("mysql");
const dotenv = require("dotenv");
const helper = require("../../utility/helper");
dotenv.config();
const destroyConnection = (obj) => {
  if (obj) obj.destroy();
};
const createConnection = () => {
  return new Promise((resolve, reject) => {
    let con = null;
    if (helper.isProdMode()) {
      con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB
      });
    } else {
      con = mysql.createConnection({
        host: process.env.DB_HOST_DEV,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB
      });
    }
    con.connect(function (err) {
      if (err) {
        con = null;
        let error = [];
        error.push(con, err);
        reject(error);
      } else {
        resolve(con);
      }
    });
  });
};
module.exports = { createConnection, destroyConnection };
