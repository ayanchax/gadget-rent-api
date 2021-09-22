const helper = require("../../../utility/helper");

class Authentication {
    constructor(userid,password) {
        this.userid=userid;
        this.password=password;
    }
    getUserEncryptedPasswordByUserId(){
        return (
            "SELECT count(objid) as dataCount,objid,userid, password, name,st_address_ln1,st_address_ln2,st_address_ln3,city,pincode,state,country,mobile_number, isActive FROM gadget_rent.users where userid=" +
            helper.addQuotes(this.userid) 
          );
    }
}
module.exports.auth = Authentication;