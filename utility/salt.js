// Nodejs encryption with CTR
const AES = require("crypto-js/aes");
const Utf8 = require("crypto-js/enc-utf8")

function encrypt(text, passphrase) {
  return AES.encrypt(text, passphrase).toString();
}

function decrypt(ciphertext,passphrase) {
  const bytes = AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(Utf8);
  return originalText;
}
const isValidPassword=(pwd)=>{
  if(!pwd) return false
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(pwd);
}
module.exports = { decrypt, encrypt,isValidPassword };