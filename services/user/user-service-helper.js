const modifyResponseData = (data) => {
  if (data[0].isAccountVerified) {
    data[0].isAccountVerified =
      data[0].isAccountVerified &&
      data[0].isAccountVerified.lastIndexOf(1) !== -1
        ? true
        : false;
  } else {
    data[0].isAccountVerified = false;
  }
};
const modifyResponseDataArray = (data) => {
  if (!data) return;
  data.forEach((element, index) => {
    if (element.isAccountVerified) {
      element.isAccountVerified =
        element.isAccountVerified &&
        element.isAccountVerified.lastIndexOf(1) !== -1
          ? true
          : false;
    } else {
      element.isAccountVerified = false;
    }
  });
};

module.exports = { modifyResponseData, modifyResponseDataArray };
