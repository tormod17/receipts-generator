require ('isomorphic-fetch');

const ClientDB = require('../models/client');
const ReceiptDB = require('../models/receipts');
const InvoiceDB = require('../models/invoice');

const mongoose = require('mongoose');

const mongoTestURL = 'mongodb://localhost/airgreets-test';
const base_url = 'http://localhost:3001/';
const userId ='5a327139dd4b790d7d17e0e5';

//const { addReceipt } = require ('../../src/actions/clients');

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
  fetch( url, config)
  .then(checkStatus)
  .then(parseJSON)
  .then(json => {
    cb(json);
  })
  .catch(error => {
    console.log(error);
  });
};

// describe('Returns index.html file from serve in dev mode', () => {
//   it('returns status code 200' , () => {
//     request(base_url);
//   });
// });


describe.only('clients entry form will respond with the correct payloads', () => {
  beforeAll(() => {
    console.log('before All Tests >>>>>>>>>>');
    mongoose.connect(mongoTestURL);
  });
  beforeEach(() => {

  });
  afterEach(() => {
    InvoiceDB.remove(() => {
      console.log('cleared Invoice Collection');
    });
    ReceiptDB.remove(() => {
      console.log('cleared Receipt Collection');
    });
    ClientDB.remove({}, () => {
      console.log('cleared Client Collection');
    });

  });
  afterAll((done) => {
    console.log('after all tests >>>>>>>>>');    
    mongoose.disconnect(done);
  });

  it('responds with status 200 from clients endpoint', () => {
    const config ={
      method: 'get'
    };

    const testUrl = base_url + 'api/clients?userId='+ userId;
    request(testUrl, config, () => {});
  });

  it.only('Add  an invoice api/client post responds with correct status code 200' , () => {
    const userId ='5a327139dd4b790d7d17e0e5';
    const data =  { 
      client: { 
        Kunde: 'Tormod Smith',
        Emailadresse: 'tormodsmith@gmail.com',
        'Straße': 'Flat 205',
        Stadt: 'London',
        PLZ: 'SW3 3DS' ,
        'Kunden-nummer': '990443',
        'Rechnungs-datum': 1516745716606
      },
      guests:{ 
        '0': {
          '_id': 'df571922-fgc6-4c2a-803f-f5ac5b8c48a3',
          'Name des Gastes': 'Micky Mouse',
          'Abreisedatum (Leistungsdatum)': 1516745908222,
          'Airbnb Einkommen':"22",
          'Airgreets Service Fee (€)':"22",
          'Anreisedatum': 1516745908222,
          'Auszahlung an Kunde': "-22",
          'Gesamtumsatz Airgreets': "44"
        } 
      },
      corrections: {},
      Belegart: 'Rechnung' 
    };
    
    const config ={
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    const testUrl = base_url + 'api/client?userId='+ userId;
    request(testUrl, config, (json) => { console.log(json)});
  });
  

  it.only('Update a client with different guest details', () => {
    const invoiceId = '597898f0-0484-11e8-ac60-d136be568de4';
    const updatedInvoice = {
      "Belegart": "Rechnung",
      "client": { 
        "listings": [{
           "_id": "b6588a0e-7203-4814-a651-dc9a8198cab6",
           "__v": 0, "Rechnungs-datum": 1517182668730,
           "Kunde": "Micky Mouse",
           "Emailadresse": "mouse@magic.com",
           "Straße": "Goofy Street",
           "Stadt": "Goof Town",
           "PLZ": "SW11",
           "Kunden-nummer": "212",
           "Anreisedatum": 1517182689044,
           "Abreisedatum (Leistungsdatum)": 1517182689044,
           "Name des Gastes": "Jordan Belfour",
           "Airgreets Service Fee (€)": "1",
           "Gesamtumsatz Airgreets": "2",
           "Auszahlung an Kunde": "-1",
           "Reinigungs-gebühr": "1",
           "Airbnb Einkommen": "1",
           "filename": "manual entry",
           "userId": "undefined",
           "created": 1517182523892,
           "clientId": "212",
           "Belegart": "Rechnung",
           "feeds": []
        }],
      "guests": {
        "0": {
          "_id": "b6588a0e-7203-4814-a651-dc9a8198cab6",
          "__v": 0,
          "Rechnungs-datum": 1517182668730,
          "Kunde": "Micky Mouse",
          "Emailadresse": "mouse@magic.com",
          "Straße": "Goofy Street",
          "Stadt": "Goof Town",
          "PLZ": "SW11",
          "Kunden-nummer": "212",
          "Anreisedatum": 1517182689044,
          "Abreisedatum (Leistungsdatum)": 1517182689044,
          "Name des Gastes": "Jordan Balsix",
          "Airgreets Service Fee (€)": "1",
          "Gesamtumsatz Airgreets": "2",
          "Auszahlung an Kunde": "-1",
          "Reinigungs-gebühr": "1",
          "Airbnb Einkommen": "1",
          "filename": "manual entry",
          "userId": "undefined",
          "created": 1517182523892,
          "clientId": "212",
          "Belegart": "Rechnung",
          "feeds": []
        }
      },
        "corrections": {}
      }
    };

    const config ={
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedInvoice)
    };
    const testUrl = base_url + 'invoice?invoiceId='+ invoiceId;
    request(testUrl, config, (json) => { console.log(json)});
  });

  it('Test api/client post same Client responds with correct status code 200' , () => {
      const userId ='5a327139dd4b790d7d17e0e5';

      const data =  { 
        client: { 
          Kunde: 'Tormod Smith',
          Emailadresse: 'tormodsmith@gmail.com',
          'Straße': 'Flat 205',
          Stadt: 'London',
          PLZ: 'SW3 3DS' ,
          'Kunden-nummer': '990443',
          'Rechnungs-datum': 1516745716606
        },
        guests:{ 
          '0': {
            '_id': 'df571922-fgc6-4c2a-803f-f5ac5b8c48a3',
            'Name des Gastes': 'Micky Mouse',
            'Abreisedatum (Leistungsdatum)': 1516745908222,
            'Airbnb Einkommen':"22",
            'Airgreets Service Fee (€)':"22",
            'Anreisedatum': 1516745908222,
            'Auszahlung an Kunde': "-22",
            'Gesamtumsatz Airgreets': "44"
          } 
        },
        corrections: {},
        Belegart: 'Rechnung' 
      };
    
    const config ={
      method: 'del',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    const testUrl = base_url + 'api/client?userId='+ userId;
    request(testUrl, config, (json) => { console.log(json)});
  });

  it('Test api/client post same Client responds with correct status code 200' , () => {
      const userId ='5a327139dd4b790d7d17e0e5';
      const data =  { 
        client: { 
          Kunde: 'Tormod Smith',
          Emailadresse: 'tormodsmith@gmail.com',
          'Straße': 'Flat 205',
          Stadt: 'London',
          PLZ: 'SW3 3DS' ,
          'Kunden-nummer': '100443',
          'Rechnungs-datum': 1516745716606
        },
        guests:{ 
          '0': {
            '_id': 'df51922-ffc6-4c2a-803f-f5ac5b8c48a3',
            'Name des Gastes': 'Mini Mouse',
            'Abreisedatum (Leistungsdatum)': 1516745908222,
            'Airbnb Einkommen':"22",
            'Airgreets Service Fee (€)':"22",
            'Anreisedatum': 1516745908222,
            'Auszahlung an Kunde': "-22",
            'Gesamtumsatz Airgreets': "44"
          } 
        },
        corrections: {},
        Belegart: 'Rechnung' 
      };

    
    const config ={
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const testUrl = base_url + 'api/client?userId='+ userId;
    request(testUrl, config, (json) => { 
      console.log(json);
      ClientDB.remove({});
      ReceiptDB.remove({});
    });
 
  });

  it('Add an invoice post responds with correct status code 200' , () => {
      const userId ='5a327139dd4b790d7d17e0e5';
      const data =    { 
        customer: { 
          Kunde: 'Tommy Gun the Coder',
          Emailadresse: 'tormodsmith@gmail.com',
          'Straße': 'Flat 205',
          Stadt: 'London',
          PLZ: 'SW3 3DS' ,
          'Kunden-nummer': '10069999'

        },
        guests:{ 
          'df571922-ffc6-4c2a-803f-f5ac5b8c48a3': { 
            'Name des Gastes': 'Micky Mouse'
          } 
        },
        corrections: {},
        Belegart: 'Rechnung' 
      };
    
    const config ={
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const testUrl = base_url + 'api/client?userId='+ userId;
    request(testUrl, config, (json) => { console.log(json)});
  });

      //db.clients.find({ '_id': '5e456391-e0f3-11e7-98f7-6dde4cc7e29e'})


  it('Test api/clients update responds with correct status code 200' , () => {
    const receiptId ='bfcd6630-e0f8-11e7-b17f-1b686e7630e3';
    const data = {
        customer: {
          Kunde: 'Jeoff Bezos',
          Straße: 'Kansas',
          Stadt: 'Wall Street',
          PLZ: 'V33 V22',
          'Kunden-nummer': '3335'
        },
        "guests": {
          "bfcd6630-e0f8-11e7-b17f-1b686e7630e3":{
            "Name des Gastes":"Bill Gates JUnior",
            "Anreisedatum":"14/12/2017",
            "Abreisedatum":"21/12/2017",
            "Airgreets Service Fee (€)":"43",
            "CLEANING FARE":"34",
            "TOTAL PAID":"77"
            }
          }
      };

    const config ={
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const testUrl = base_url + 'api/clients?receiptId=' + receiptId;    request(testUrl, config, (json) => console.log(json));
    
  });
});
