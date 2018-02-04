const uuidv4= require('uuid/v4');
const DATETIMESTAMP = Date.now();

exports.formatTimeStamp = (timeStamp) => {
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

const formatDate = date => {
  const timestamp = (/\D+/).test(date) ? new Date(date).getTime() : date;
  return timestamp;
};

exports.formatDate = date => {
  const timestamp = (/\D+/).test(date) ? new Date(date).getTime() : date;
  return timestamp;
};

exports.createTransactionList = (list, filename) => {
    return list.map(record => {
    Object.keys(record).forEach(key => {
      if (key.includes('datum')){
        record[key] = formatDate(record[key]) || DATETIMESTAMP;
      }
    })
    return {
        ...record,
        filename,
        created: DATETIMESTAMP,
        clientId: record['Kundennummer'],
        Belegart: record['Auszahlung'] === 'X' ? 'Auszahlung' : 'Rechnung',
        _id: uuidv4()
    };      
  })
}

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

exports.findTransactionsByIds = (transactions, currentInvoice) => {
  return transactions.map(listing => {
    if (currentInvoice.transactions.includes(listing._id)) {
      return listing;
    }
  }).filter(listing => { if(listing) return listing });
};

exports.getDateQuery = (month, year) => {
    let toMonth = Number(month) + 1;
    let toYear = year;
    
    if (toMonth === 12) {
      toMonth = 0;
      toYear = Number(toYear) + 1;
    } 

    const fromDate =  new Date(year, Number(month), 1).getTime();
    const toDate = new Date(toYear, Number(toMonth), 1).getTime();  

    let query = {
      'Rechnungsdatum': {
       '$gte': fromDate,
       '$lt': toDate
      }
    };
    return query;
  }