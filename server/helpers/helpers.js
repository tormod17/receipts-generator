const uuidv4= require('uuid/v4');
const DATETIMESTAMP = Date.now();


const sumUpTotals = (transactions, fieldName) =>
  Object.values(transactions || {}).reduce((a, b) => {
    transactions = 
      (b && b[fieldName] && parseFloat(b[fieldName].replace( /,/g, '')) || 0);
    a +=   transactions;
    return a;
  }, 0);

exports.calculateTotals = (type, guests, corrections) => {
  const key1 = type === 'Auszahlung' ? 'Auszahlung an Kunde' : 'Gesamtumsatz Airgreets';
  const key2 = type === 'Auszahlung' ? 'Auszahlungskorrektur in €' : 'Rechnungskorrektur in €';
  const sumGuests = sumUpTotals(guests, key1);
  const sumCorr = sumUpTotals(corrections, key2);
  return (sumGuests + sumCorr).toFixed(2) ;
}

exports.calculateTaxTotals = (type, guests, corrections) => {
  const key1 = type === 'Auszahlung' ? 'Auszahlung an Kunde' : 'Gesamtumsatz Airgreets';
  const sumGuests = sumUpTotals(guests, key1);
  const sumCorr = sumUpTotals(corrections, 'Ust-Korrektur');
  return ((((sumGuests) / 119 ) * 19) + sumCorr).toFixed(2);
}

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


exports.formatDate = date => {
  const timestamp = (/\D+/).test(date) ? new Date(date).getTime() : date;
  return timestamp;
};


const formatDate = date => {
  const timestamp = (/\D+/).test(date) ? new Date(date).getTime() : date;
  return timestamp;
};

const sortObject = (o) => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});

exports.splitDuplicatesUniques = (newarr, oldarr) => {
  let duplicates = [];
  let unique = [];

  var matchExcId = (obj1, obj2) => {
    delete obj1._id;
    delete obj2._id;
    const a  = sortObject(obj1);
    const b =  sortObject(obj2);
    const { stringify }  = JSON;
    return stringify(a) === stringify(b);
  }
  newarr.forEach((nt) => {
    // check an exisitng transaction exists.
    const dup = oldarr.find((t) => {
      return matchExcId(t, nt);
    })
    if(dup) {
      duplicates.push(dup)
    } else  {
      unique.push(nt)
    }
  })
  return [duplicates, unique];
}


exports.createTransactionList = (list, filename) => {
  return list.map(record => {
    Object.keys(record).forEach(key => {
      if (key.includes('datum')){
        record[key] = formatDate(record[key]) || DATETIMESTAMP;
      }
    })
    return {
        ...sortObject(record),
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