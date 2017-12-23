
exports.formatDate = (timeStamp) => {
  if (!timeStamp) return false;
  let newDate = new Date(timeStamp);
  let dd = newDate.getDate();
  let mm = newDate.getMonth() + 1; //January is 0!

  const yyyy = newDate.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  newDate = dd + '/' + mm + '/' + yyyy;
  return newDate;
};