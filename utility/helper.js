const isBoolean = (l) => {
  return Boolean(l) === false || Boolean(l) === true;
};

const isProdMode = () => {
  const dotenv = require("dotenv");
  dotenv.config();
  if (process.env.MODE === "dev") return false;
  return true;
};

function addQuotes(value) {
  var quotedlet = "'" + value + "'";
  return quotedlet;
}

function format(data) {
  return data
    .replace("&quot;", "'")
    .replace("&amp;", "&")
    .replace("&#039;", "'");
}
const getID=()=>{
    const { v4: uuidv4 } = require('uuid');
    return uuidv4();
}
 
const randomKeyWord = (keyword) => {
  if (keyword[Math.floor(Math.random() * keyword.length)] === undefined) {
    return keyword[0];
  }
  return keyword[Math.floor(Math.random() * keyword.length)];
};
const noImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLG67OCTdsrpf_nDsSC03j5j2x7pSK7XOogQ&usqp=CAU";

const splitData = (str, delim) => {
  try {
    let _array = str.split(delim);
    let _returningArray = [];
    _array.forEach((obj) => {
      _returningArray.push({ name: obj });
    });
    return _returningArray;
  } catch (error) {
    _array.push({ name: str });
    return _array;
  }
};

function cleanWarning(error) {
  return error.replace(
    /Detector is not able to detect the language reliably.\n/g,
    ""
  );
}
const isValidEmail=(email)=>{
  if(!email) return false;
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(email);
}

const isValidZIP=(zip)=>{
  if(!zip) return false;
  if(isNaN(zip)) return false;
  if(zip.length===6) return true;
  return false
}

const isValidPhoneNumber=(phone)=>{
  if(!phone) return false;
  if(isNaN(phone)) return false;
  if(phone.length===10) return true;
  return false
}
module.exports = {
  format,
  addQuotes,
  isBoolean,
  isProdMode,
  getID,
  isValidEmail,
  isValidZIP,
  isValidPhoneNumber
};
