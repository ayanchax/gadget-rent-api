class User {
  constructor(
    objid,
    userId,
    password,
    thirdPartySignIn,
    isActive,
    isSessionActive,
    sessionToken,
    st_address_ln1,
    st_address_ln2,
    st_address_ln3,
    city,
    pincode,
    state,
    country,
    mobile_number
  ) {
    this.objectid = objid;
    this.uid = userId;
    this.password = password;
    this.thirdPartySignIn = thirdPartySignIn;
    this.isActive = isActive;
    this.isSessionActive = isSessionActive;
    this.sessionToken = sessionToken;
    this.st_address_ln1 = st_address_ln1;
    this.st_address_ln2 = st_address_ln2;
    this.st_address_ln3 = st_address_ln3;
    this.city = city;
    this.pincode = pincode;
    this.state = state;
    this.country = country;
    this.mobile_number = mobile_number;
    this.insertQuery = null;
  }

  getUserInsertQuery() {
    const helper = require("../../utility/helper");
    return (
      "INSERT INTO gadget_rent.users"
      +"(objid," +
      "userid," +
      "password," +
      "thirdPartySignIn," +
      "isActive," +
      "isSessionActive," +
      "sessionToken," +
      "st_address_ln1," +
      "st_address_ln2," +
      "st_address_ln3," +
      "city," +
      "pincode," +
      "state," +
      "country," +
      "mobile_number)" +
      " VALUES" +
      "(" +
      helper.addQuotes(this.objectid) +
      "," +
      helper.addQuotes(this.uid) +
      "," +
      helper.addQuotes(this.password) +
      "," +
      this.thirdPartySignIn+
      "," +
      this.isActive +
      "," +
      this.isSessionActive +
      "," +
      
      helper.addQuotes(this.sessionToken)+
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
      helper.addQuotes(this.mobile_number)+
      ")"
    );
  }
}
module.exports.user = User;
