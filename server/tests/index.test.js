require('isomorphic-fetch');

const ClientDB = require('../models/client');
const ReceiptDB = require('../models/receipts');
const InvoiceDB = require('../models/invoice');

const mongoose = require('mongoose');

const mongoTestURL = 'mongodb://localhost/airgreets-test';
const base_url = 'http://localhost:3001/';
const userId = '5a327139dd4b790d7d17e0e5';


function createConfig(method, data) {
  return {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
}

function checkStatus(response) {
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  return response;
}

function parseJSON(response) {
  return response.json();
}

const request = (url, config, cb) => {
  fetch(url, config)
    .then(checkStatus)
    .then(parseJSON)
    .then(json => {
      cb(json);
    })
    .catch(error => {
      console.log(error);
    });
};

describe('Returns index.html file from serve in dev mode', () => {
  it('returns status code 200', () => {
    request(base_url);
  });
});


describe.only('clients entry form will respond with the correct payloads', () => {
  let userId = '5a327139dd4b790d7d17e0e5';

  let data = {
    Belegart: "Rechnung",
    client: {
      "Rechnungsdatum": 1517430999991,
      "Kunde": "Micky Mouse",
      "Emailadresse": "mouse@magic.com",
      "Straße": "Goofy Street",
      "Stadt": "Goof Town",
      "PLZ": "SW11",
      "Kundennummer": "333"
    },
    corrections: {},
    guests: {}
  };

  let guest ={
    "0": {
      "_id": "eec8f8ab-201b-4d9a-b372-89fd11de11f7",
      "Anreisedatum": 1515153600000,
      "Abreisedatum (Leistungsdatum)": 1517431009394,
      "Name des Gastes": "Mini Mouse",
      "Airgreets Service Fee (€)": "200",
      "Gesamtumsatz Airgreets": "300",
      "Auszahlung an Kunde": "100",
      "Reinigungs-gebühr": "100",
      "Airbnb Einkommen": "400"
    }
  }

  let correction = {
    "0": {
      "_id": "fa643c76-37d1-4e18-bf99-b2cd9e1a9a44",
      "Ust-Korrektur": "15.97",
      "Sonstige Leistungsbeschreibung": "dirty",
      "Rechnungskorrektur in €": "100"
    }
  }

  function removeAllCollections() {
    InvoiceDB.remove({}, (err, res) => {
      console.log('cleared Invoice Collection', res, err);
    });
    ReceiptDB.remove({}, (err, res) => {
      console.log('cleared Receipt Collection', res, err);
    });
    ClientDB.remove({ "Kundennummer": "333" }, (err, res) => {
      console.log('cleared Client Collection', res, err);
    });
  }

  beforeAll(() => {
    removeAllCollections()
  });
  beforeEach(() => {

  });
  afterEach(() => {


  });
  afterAll((done) => {
    removeAllCollections()
  });


  it('Add an invoice with a new customer and invoice with a single guest transation in Jan', () => {
    const testData = {
      ...data,
      guests: {
        ...guest
      }
    };
    const testUrl = base_url + 'api/client?userId=' + userId;
    request(testUrl, createConfig("post", testData), (json) => {
      console.log(json)
    });
  });

  it('Add a new invoice with a new client and add new single guest transaction in Jan', () => {
    const testData = {
      ...data,
      guests: {
        ...guest
      }
    };
    const testUrl = base_url + 'api/client?userId=' + userId;
    request(testUrl, createConfig("post", testData), (json) => {
      // should create a new invocie and a new client in Jan.
      console.log(json)
    });
  });

  it('Add an existing client with a new single guest transaction in Feb', () => {
    const testData = {
      ...data,
      client: {
        ...data.client,
        "Rechnungsdatum": 1518609600000,
      },
      guests: {      
        "0": {
          ...guest["0"],
          "_id": "eec8f8ab-201b-4d9a-b372-89fd11de337", // always a unique key
          "Name des Gastes": "only guest second month",
        }
      }
    };
    const testUrl = base_url + 'api/client?userId=' + userId;
    request(testUrl, createConfig("post", testData), (json) => {
      console.log(json) // should see in next month with increased invoice number
    });
  });

  it('Add an existing client with an additional single guest transaction in Feb', () => {
    const testData = {
      ...data,
      client: {
        ...data.client,
        "Rechnungsdatum": 1518609600000,
      },
      guests: {
        "0": {
          ...guest["0"],
          "_id": "eec8f8ab-201b-4d9a-b372-89fd11de338", // always a unique key
          "Name des Gastes": "only guest second month",
        }
      }
    };
    const testUrl = base_url + 'api/client?userId=' + userId;
    request(testUrl, createConfig("post", testData), (json) => {
      console.log(json) // existing invoice for that month need to edit it.
    });
  });

  it('Add an new client with a guest and a correction in Feb', () => {
    const testData = {
      ...data,
      client: {
        ...data.client,
        "Rechnungsdatum": 1518609600000,
        "Kundennummer": "448"
      },
      guests: {
        "0": {
          ...guest["0"],
          "_id": "eec8f8ab-201b-4d9a-b372-89fd11de888", // always a unique key
        }
      },
      corrections: {
        ...correction
      }
    };
    const testUrl = base_url + 'api/client?userId=' + userId;
    request(testUrl, createConfig("post", testData), (json) => {
      console.log(json) // existing invoice for that month need to edit it.
    });
  });

  it.only('Add an new client with a guest and a new correction in Feb', () => {
    newCorrection = {
      "0": {
        ...correction["0"],
        "_id": "fa643c76-37d1-4e18-bf99-b2cd9e1a9a3332",
      }
    }
    newGuest = {
      "0":{
        ...guest["0"],
        "_id": "fa643c76-37d1-4e18-bf99-b2cd9e1a9a555"
      }
    }
    const testData = {
      ...data,
      client: {
        ...data.client,
        "Rechnungsdatum": 1518609600000,
        "Kundennummer": "888"
      },
      guests: {
        ...newGuest
      },
      corrections: {
        ...newCorrection
      }
    };
    const testUrl = base_url + 'api/client?userId=' + userId;
    request(testUrl, createConfig("post", testData), (json) => {
      console.log(json) // existing invoice for that month need to edit it.
    });
  });


  // it('Update a client with different guest details', () => {
  //   const invoiceId = '597898f0-0484-11e8-ac60-d136be568de4';
  //   const updatedInvoice = {
  //     "Belegart": "Rechnung",
  //     "client": { 
  //       "listings": [{
  //          "_id": "b6588a0e-7203-4814-a651-dc9a8198cab6",
  //          "__v": 0, "Rechnungsdatum": 1517182668730,
  //          "Kunde": "Micky Mouse",
  //          "Emailadresse": "mouse@magic.com",
  //          "Straße": "Goofy Street",
  //          "Stadt": "Goof Town",
  //          "PLZ": "SW11",
  //          "Kundennummer": "212",
  //          "Anreisedatum": 1517182689044,
  //          "Abreisedatum (Leistungsdatum)": 1517182689044,
  //          "Name des Gastes": "Jordan Belfour",
  //          "Airgreets Service Fee (€)": "1",
  //          "Gesamtumsatz Airgreets": "2",
  //          "Auszahlung an Kunde": "-1",
  //          "Reinigungs-gebühr": "1",
  //          "Airbnb Einkommen": "1",
  //          "filename": "manual entry",
  //          "userId": "undefined",
  //          "created": 1517182523892,
  //          "clientId": "212",
  //          "Belegart": "Rechnung",
  //          "feeds": []
  //       }],
  //     "guests": {
  //       "0": {
  //         "_id": "b6588a0e-7203-4814-a651-dc9a8198cab6",
  //         "__v": 0,
  //         "Rechnungsdatum": 1517182668730,
  //         "Kunde": "Micky Mouse",
  //         "Emailadresse": "mouse@magic.com",
  //         "Straße": "Goofy Street",
  //         "Stadt": "Goof Town",
  //         "PLZ": "SW11",
  //         "Kundennummer": "212",
  //         "Anreisedatum": 1517182689044,
  //         "Abreisedatum (Leistungsdatum)": 1517182689044,
  //         "Name des Gastes": "Jordan Balsix",
  //         "Airgreets Service Fee (€)": "1",
  //         "Gesamtumsatz Airgreets": "2",
  //         "Auszahlung an Kunde": "-1",
  //         "Reinigungs-gebühr": "1",
  //         "Airbnb Einkommen": "1",
  //         "filename": "manual entry",
  //         "userId": "undefined",
  //         "created": 1517182523892,
  //         "clientId": "212",
  //         "Belegart": "Rechnung",
  //         "feeds": []
  //       }
  //     },
  //       "corrections": {}
  //     }
  //   };

  //   const config ={
  //     method: 'put',
  //     headers,
  //     body: JSON.stringify(updatedInvoice)
  //   };
  //   const testUrl = base_url + 'invoice?invoiceId='+ invoiceId;
  //   request(testUrl, config, (json) => { console.log(json)});
  // });

  // it('Test api/client post same Client responds with correct status code 200' , () => {
  //     const userId ='5a327139dd4b790d7d17e0e5';

  //     const data =  { 
  //       client: { 
  //         Kunde: 'Tormod Smith',
  //         Emailadresse: 'tormodsmith@gmail.com',
  //         'Straße': 'Flat 205',
  //         Stadt: 'London',
  //         PLZ: 'SW3 3DS' ,
  //         'Kundennummer': '990443',
  //         'Rechnungsdatum': 1516745716606
  //       },
  //       guests:{ 
  //         '0': {
  //           '_id': 'df571922-fgc6-4c2a-803f-f5ac5b8c48a3',
  //           'Name des Gastes': 'Micky Mouse',
  //           'Abreisedatum (Leistungsdatum)': 1516745908222,
  //           'Airbnb Einkommen':"22",
  //           'Airgreets Service Fee (€)':"22",
  //           'Anreisedatum': 1516745908222,
  //           'Auszahlung an Kunde': "-22",
  //           'Gesamtumsatz Airgreets': "44"
  //         } 
  //       },
  //       corrections: {},
  //       Belegart: 'Rechnung' 
  //     };

  //   const config ={
  //     method: 'del',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   };

  //   const testUrl = base_url + 'api/client?userId='+ userId;
  //   request(testUrl, config, (json) => { console.log(json)});
  // });

  // it('Test api/client post same Client responds with correct status code 200' , () => {
  //     const userId ='5a327139dd4b790d7d17e0e5';
  //     const data =  { 
  //       client: { 
  //         Kunde: 'Tormod Smith',
  //         Emailadresse: 'tormodsmith@gmail.com',
  //         'Straße': 'Flat 205',
  //         Stadt: 'London',
  //         PLZ: 'SW3 3DS' ,
  //         'Kundennummer': '100443',
  //         'Rechnungsdatum': 1516745716606
  //       },
  //       guests:{ 
  //         '0': {
  //           '_id': 'df51922-ffc6-4c2a-803f-f5ac5b8c48a3',
  //           'Name des Gastes': 'Mini Mouse',
  //           'Abreisedatum (Leistungsdatum)': 1516745908222,
  //           'Airbnb Einkommen':"22",
  //           'Airgreets Service Fee (€)':"22",
  //           'Anreisedatum': 1516745908222,
  //           'Auszahlung an Kunde': "-22",
  //           'Gesamtumsatz Airgreets': "44"
  //         } 
  //       },
  //       corrections: {},
  //       Belegart: 'Rechnung' 
  //     };


  //   const config ={
  //     method: 'post',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   };
  //   const testUrl = base_url + 'api/client?userId='+ userId;
  //   request(testUrl, config, (json) => { 
  //     console.log(json);
  //     ClientDB.remove({});
  //     ReceiptDB.remove({});
  //   });

  // });

  // it('Add an invoice post responds with correct status code 200' , () => {
  //     const userId ='5a327139dd4b790d7d17e0e5';
  //     const data =    { 
  //       customer: { 
  //         Kunde: 'Tommy Gun the Coder',
  //         Emailadresse: 'tormodsmith@gmail.com',
  //         'Straße': 'Flat 205',
  //         Stadt: 'London',
  //         PLZ: 'SW3 3DS' ,
  //         'Kundennummer': '10069999'

  //       },
  //       guests:{ 
  //         'df571922-ffc6-4c2a-803f-f5ac5b8c48a3': { 
  //           'Name des Gastes': 'Micky Mouse'
  //         } 
  //       },
  //       corrections: {},
  //       Belegart: 'Rechnung' 
  //     };

  //   const config ={
  //     method: 'post',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   };
  //   const testUrl = base_url + 'api/client?userId='+ userId;
  //   request(testUrl, config, (json) => { console.log(json)});
  // });

  //db.clients.find({ '_id': '5e456391-e0f3-11e7-98f7-6dde4cc7e29e'})


  // it('Test api/clients update responds with correct status code 200' , () => {
  //   const receiptId ='bfcd6630-e0f8-11e7-b17f-1b686e7630e3';
  //   const data = {
  //       customer: {
  //         Kunde: 'Jeoff Bezos',
  //         Straße: 'Kansas',
  //         Stadt: 'Wall Street',
  //         PLZ: 'V33 V22',
  //         'Kundennummer': '3335'
  //       },
  //       "guests": {
  //         "bfcd6630-e0f8-11e7-b17f-1b686e7630e3":{
  //           "Name des Gastes":"Bill Gates JUnior",
  //           "Anreisedatum":"14/12/2017",
  //           "Abreisedatum":"21/12/2017",
  //           "Airgreets Service Fee (€)":"43",
  //           "CLEANING FARE":"34",
  //           "TOTAL PAID":"77"
  //           }
  //         }
  //     };

  //   const config ={
  //     method: 'put',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   };
  //   const testUrl = base_url + 'api/clients?receiptId=' + receiptId;    request(testUrl, config, (json) => console.log(json));

  // });
});