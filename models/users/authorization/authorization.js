const helper = require("../../../utility/helper");

class Authorization {
  constructor(oid, session, sessionDetail) {
    this.oid = oid;
    this.session = session;
    this.sessionDetail = sessionDetail;
  }
  getUserById() {
    return (
      "SELECT count(objid) as dataCount,objid,userid, password, name,st_address_ln1,st_address_ln2,st_address_ln3,city,pincode,state,country,mobile_number, accountVerificationLink, isActive FROM gadget_rent.users where objid=" +
      helper.addQuotes(this.oid)
    );
  }
  checkIfSessionEntryExistsForUser(isSignIn) {
    if (isSignIn) {
      return (
        "SELECT count(objid) as dataCount,isSessionActive FROM gadget_rent.user_session_detail where uid=" +
        helper.addQuotes(this.oid)
      );
    }
    return (
      "SELECT count(objid) as dataCount,isSessionActive FROM gadget_rent.user_session_detail where uid=" +
      helper.addQuotes(this.oid) +
      " and sessionToken= " +
      helper.addQuotes(this.session)
    );
  }
  updateSessionToActiveForUser() {
    return `UPDATE gadget_rent.user_session_detail SET isSessionActive =1, sessionMetaData=${helper.addQuotes(
      this.sessionDetail
    )}, sessionToken=${helper.addQuotes(
      this.session
    )}, sessionEndtime=null, lastModifiedTime=CURRENT_TIMESTAMP where uid=${helper.addQuotes(
      this.oid
    )} `;
  }
  updateSessionToInActiveForUser() {
    return `UPDATE gadget_rent.user_session_detail SET isSessionActive =0, sessionMetaData=null, sessionToken=null, sessionEndtime=CURRENT_TIMESTAMP, lastModifiedTime=CURRENT_TIMESTAMP where uid=${helper.addQuotes(
      this.oid
    )} `;
  }
  insertAuthorizationActiveSessionQuery() {
    return ` INSERT INTO gadget_rent.user_session_detail
            (
            uid,
            sessionToken,
            isSessionActive,
            sessionStarttime,
            sessionEndtime,
            sessionMetaData)
            VALUES (
                ${helper.addQuotes(this.oid)} , ${helper.addQuotes(
      this.session
    )},1, CURRENT_TIMESTAMP, null, ${helper.addQuotes(this.sessionDetail)}
            )`;
  }
}
module.exports.authorization = Authorization;
