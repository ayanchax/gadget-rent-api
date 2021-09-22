const express = require("express");
const authorizationServiceRouter = express.Router();
const dotenv = require("dotenv");
const helper = require("../../../utility/helper");
const passwordSalter = require("../../../utility/salt");
const messages = require("../../../utility/messages");
const connection = require("../../../database/mysql/connection");
const executor = require("../../../database/mysql/executor");
dotenv.config();

// sign in authenticated user

authorizationServiceRouter.get('/signin',(req,res)=>{
const objectid = req.query?._gid
const sessionid=req.query?._gsession
if(!objectid || !sessionid){
    res.status(401).json({
        msg: messages.USER.authorization_error,
        authorized: false,
        error: 401,
      });
      return;
}
const {
    authorization,
  } = require("../../../models/users/authorization/authorization");
  var _auth = new authorization(objectid,sessionid,null);
  let object = null;
  connection
    .createConnection()
    .then((connection_object) => {
      object = connection_object;
      executor
        .executeQuery(_auth.getUserById(), object)
        .then((result) => {
          const isAuthorized = () => {
            if (result.length === 0) return false;
            return (
              result[0].dataCount === 1 &&
              result[0].objid===objectid &&
              result[0].isActive &&
              result[0].isActive.lastIndexOf(1) !== -1
            );
          };
          if (isAuthorized()) {
            let sessionMetaData={
                _gid: result[0].objid,
                _gsession: sessionid,
                _userid: result[0].userid,
                _name: result[0].name,
                _address: [
                  {
                    addr_1: result[0].st_address_ln1,
                    addr_2: result[0].st_address_ln2,
                    addr_3: result[0].st_address_ln3,
                  },
                ],
                _city: result[0].city,
                _pincode: result[0].pincode,
                _state: result[0].state,
                _country: result[0].country,
                _mobile_number: result[0].mobile_number,
                _accountVerificationLink: result[0].accountVerificationLink,
              }
            _auth.sessionDetail=JSON.stringify(sessionMetaData);
            executor
            .executeQuery(_auth.checkIfSessionEntryExistsForUser(true), object)
            .then((result) => {
               if(result[0].dataCount === 0){
                executor
                .executeQuery(_auth.insertAuthorizationActiveSessionQuery(), object)
                .then(() => {
                    res.status(200).json({
                        msg: messages.USER.authorization_done,
                        authorized: true,
                        sessionMetaData:sessionMetaData
                        });
                }).catch((err) => {
                    res.status(401).json({
                        msg: messages.USER.authorization_error,
                        authorized: false,
                        error: 401,
                    });
                  }).finally(() => {
                    connection.destroyConnection(object);
                  });
               }
              else if(result[0].dataCount ===1 &&  result[0].isSessionActive &&
                result[0].isSessionActive.lastIndexOf(0) !== -1){
                   // update in case session becomes inactive internally
                   executor
                .executeQuery(_auth.updateSessionToActiveForUser(), object)
                .then(() => {
                    res.status(200).json({
                        msg: messages.USER.authorization_done,
                        authorized: true,
                        sessionDetail:sessionMetaData
                        });
                }).catch((err) => {
                    res.status(401).json({
                        msg: messages.USER.authorization_error,
                        authorized: false,
                        error: 401,
                    });
                  }).finally(() => {
                    connection.destroyConnection(object);
                  }); 
               }
               else {
                res.status(200).json({
                    msg: messages.USER.authorization_done,
                    authorized: true,
                    sessionDetail:sessionMetaData
                    });
               }
            });
          } else {
            res.status(401).json({
              msg: messages.USER.authorization_error,
              authorized: false,
              error: 401,
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
        
    })
    .catch((err) => {
      res.status(500).json({
        msg: messages.CONNECTION_FAILED,
        diagnostics: err,
        authenticated: false,
        error: 500,
      });
    });
})

// sign out authenticated user

authorizationServiceRouter.get('/signout',(req,res)=>{
    const objectid = req.query?._gid
    const sessionid=req.query?._gsession
    if(!objectid || !sessionid){
        res.status(401).json({
            msg: messages.USER.unauthorization_error,
            unauthorized: false,
            error: 401,
          });
          return;
    }
    const {
        authorization,
      } = require("../../../models/users/authorization/authorization");
      var _auth = new authorization(objectid,sessionid,null);
      let object = null;
      connection
        .createConnection()
        .then((connection_object) => {
          object = connection_object;
          executor
            .executeQuery(_auth.getUserById(), object)
            .then((result) => {
              const isAuthorized = () => {
                if (result.length === 0) return false;
                return (
                  result[0].dataCount === 1 &&
                  result[0].objid===objectid &&
                  result[0].isActive &&
                  result[0].isActive.lastIndexOf(1) !== -1

                );
              };
              if (isAuthorized()) {
                executor
                .executeQuery(_auth.checkIfSessionEntryExistsForUser(false), object)
                .then((result) => {
                   if(result[0].dataCount === 0){
                    res.status(401).json({
                        msg: messages.USER.unauthorization_error,
                        unauthorized: false,
                        error: 401,
                      });  
                      return  
                }
                   if(result[0].dataCount ===1 &&  result[0].isSessionActive &&
                    result[0].isSessionActive.lastIndexOf(1) !== -1){
                       // update active session to inactive
                       executor
                    .executeQuery(_auth.updateSessionToInActiveForUser(), object)
                    .then(() => {
                        res.status(200).json({
                            msg: messages.USER.unauthorization_done,
                            unauthorized: true,
                            sessionMetaData:[]
                            });
                    }).catch((err) => {
                        res.status(401).json({
                            msg: messages.USER.unauthorization_error,
                            unauthorized: false,
                            error: 401,
                        });
                      }).finally(() => {
                        connection.destroyConnection(object);
                      }); 
                   }
                    
                });
              } else {
                res.status(401).json({
                  msg: messages.USER.unauthorization_error,
                  unauthorized: false,
                  error: 401,
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
            
        })
        .catch((err) => {
          res.status(500).json({
            msg: messages.CONNECTION_FAILED,
            diagnostics: err,
            authenticated: false,
            error: 500,
          });
        });
    })


module.exports = authorizationServiceRouter;