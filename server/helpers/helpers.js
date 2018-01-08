
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

exports.calculateTotals = (type, guests, corrections, tax) => {
  const key1 = type === 'Auszahlung' ? 'Auszahlung an Kunde' : 'Gesamtumsatz Airgreets';
  const key2 = type === 'Auszahlung' ? 'Auszahlungskorrektur in €': 'Rechnungskorrektur in €';

  const sumGuests =Object.values(guests|| {}).reduce((a, b) => {
      const clientTotal = (b && b[key1] && parseFloat(b[key1].replace( /,/g, ''))) || 0;
      a +=  clientTotal;
      return a;
  }, 0);
  const sumCorr =Object.values(corrections || {}).reduce((a, b) => {
      const corrections = 
          (b && b[key2] && parseFloat(b[key2].replace( /,/g, '')) || 0);
      a +=   corrections;
      return a;
  }, 0);

  
  if (tax) {
    return (((sumGuests + sumCorr) / 119 ) * 19).toFixed(2);
  }
  return (sumGuests + sumCorr).toFixed(2) ;
};
