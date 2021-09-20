const helper = require("../../utility/helper");
class User {
  constructor(
    objid,
    userId,
    password,
    thirdPartySignIn,
    isActive,
    name,
    st_address_ln1,
    st_address_ln2,
    st_address_ln3,
    city,
    pincode,
    state,
    country,
    mobile_number,
    isAccountVerified,
    accountVerificationLink
  ) {
    this.objectid = objid;
    this.uid = userId;
    this.password = password;
    this.thirdPartySignIn = thirdPartySignIn;
    this.isActive = isActive;
    this.name = name;
    this.st_address_ln1 = st_address_ln1;
    this.st_address_ln2 = st_address_ln2;
    this.st_address_ln3 = st_address_ln3;
    this.city = city;
    this.pincode = pincode;
    this.state = state;
    this.country = country;
    this.mobile_number = mobile_number;
    this.isAccountVerified = isAccountVerified;
    this.accountVerificationLink = accountVerificationLink;
    this.insertQuery = null;
    this.updatePersonalDetailsQuery = null;
    this.findUserCountByIdQuery = null;
    this.generateUserVerificationLink = null;
  }
  getGenerateUserVerificationLink() {
    return (
      "UPDATE gadget_rent.users SET " +
      " accountVerificationLink =" +
      helper.addQuotes(this.accountVerificationLink) +
      "," +
      " lastModifiedTime=CURRENT_TIMESTAMP where objid = " +
      helper.addQuotes(this.objectid)
    );
  }

  getUpdateAccountVerificationFlagQuery() {
    return (
      "UPDATE gadget_rent.users SET " +
      " isAccountVerified =" +
      this.isAccountVerified +
      "," +
      " lastModifiedTime=CURRENT_TIMESTAMP where objid = " +
      helper.addQuotes(this.objectid)
    );
  }

  getUpdatePasswordQuery() {
    return (
      "UPDATE gadget_rent.users SET " +
      " password =" +
      helper.addQuotes(this.password) +
      "," +
      " lastModifiedTime=CURRENT_TIMESTAMP where objid = " +
      helper.addQuotes(this.objectid)
    );
  }
  getFindUserCountByIdQuery() {
    return (
      "SELECT count(objid) as dataCount FROM gadget_rent.users where objid=" +
      helper.addQuotes(this.objectid)
    );
  }

  getActiveUserByIdQuery() {
    return (
      "SELECT userid, name, st_address_ln1, st_address_ln2, st_address_ln3,city,pincode,state,country,mobile_number,isAccountVerified,accountVerificationLink,lastModifiedTime FROM gadget_rent.users where objid=" +
      helper.addQuotes(this.objectid) +" and isActive=1"
    );
  }

  getFindUserPasswordByIdQuery() {
    return (
      "SELECT count(objid) as dataCount, password FROM gadget_rent.users where objid=" +
      helper.addQuotes(this.objectid)
    );
  }

  getUserAccountVerificationLinkByIdQuery() {
    return (
      "SELECT count(objid) as dataCount, accountVerificationLink,isAccountVerified FROM gadget_rent.users where objid=" +
      helper.addQuotes(this.objectid)
    );
  }

  getUpdateUserPersonalDetailsQuery() {
    return (
      "UPDATE gadget_rent.users SET " +
      " name =" +
      helper.addQuotes(this.name) +
      "," +
      " st_address_ln1 =" +
      helper.addQuotes(this.st_address_ln1) +
      "," +
      " st_address_ln2 =" +
      helper.addQuotes(this.st_address_ln2) +
      "," +
      " st_address_ln3 =" +
      helper.addQuotes(this.st_address_ln3) +
      "," +
      " city =" +
      helper.addQuotes(this.city) +
      "," +
      " pincode =" +
      helper.addQuotes(this.pincode) +
      "," +
      " state =" +
      helper.addQuotes(this.state) +
      "," +
      " country =" +
      helper.addQuotes(this.country) +
      "," +
      " mobile_number =" +
      helper.addQuotes(this.mobile_number) +
      ", lastModifiedTime=CURRENT_TIMESTAMP where objid = " +
      helper.addQuotes(this.objectid)
    );
  }
  getUserInsertQuery() {
    return (
      "INSERT INTO gadget_rent.users" +
      "(objid," +
      "userid," +
      "password," +
      "thirdPartySignIn," +
      "isActive," +
      "name," +
      "st_address_ln1," +
      "st_address_ln2," +
      "st_address_ln3," +
      "city," +
      "pincode," +
      "state," +
      "country," +
      "mobile_number, isAccountVerified, accountVerificationLink)" +
      " VALUES" +
      "(" +
      helper.addQuotes(this.objectid) +
      "," +
      helper.addQuotes(this.uid) +
      "," +
      helper.addQuotes(this.password) +
      "," +
      this.thirdPartySignIn +
      "," +
      this.isActive +
      "," +
      helper.addQuotes(this.name) +
      "," +
      helper.addQuotes(this.st_address_ln1) +
      "," +
      helper.addQuotes(this.st_address_ln2) +
      "," +
      helper.addQuotes(this.st_address_ln3) +
      "," +
      helper.addQuotes(this.city) +
      "," +
      helper.addQuotes(this.pincode) +
      "," +
      helper.addQuotes(this.state) +
      "," +
      helper.addQuotes(this.country) +
      "," +
      helper.addQuotes(this.mobile_number) +
      "," +
      this.isAccountVerified +
      "," +
      helper.addQuotes(this.accountVerificationLink) +
      ")"
    );
  }
}
module.exports.user = User;
