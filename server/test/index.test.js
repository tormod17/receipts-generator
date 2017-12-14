require ('isomorphic-fetch');
//const { addReceipt } = require ('../../src/actions/receipts');

function checkStatus(response) {
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  console.log(response.status);
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

const base_url = 'http://localhost:3001/';
const userId ='5a327139dd4b790d7d17e0e5';

describe('Returns index.html file from serve in dev mode', () => {
  it('returns status code 200' , () => {
    request(base_url);
  });
});


describe('Receipt entry form will respond with the correct payloads', () => {
  it('responds with status 200 from receipts endpoint', () => {
    const config ={
      method: 'get',
    };

    const testUrl = base_url + 'api/receipts?userId='+ userId;
    request(testUrl, config, () => {});
  });

  it.only('Test api/receipt post responds with correct status code 200' , () => {
      const userId ='5a327139dd4b790d7d17e0e5';
      const data = {
          customer: {
            "Kunde":"Warren Buffet",
            "Straße":"New York",
            "Stadt":"Wall Street",
            "PLZ":"V33 V22",
            "Kunden-nummer":"3335"
          },
          "guests": {
            "591b7393-1de8-4ae8-970d-ae676bbb2362":{
              "Name des Gastes":"Bill Gates",
              "Anreisedatum":"14/12/2017",
              "Abreisedatum":"21/12/2017",
              "Airgreets Service Fee (€)":"43",
              "CLEANING FARE":"34",
              "TOTAL PAID":"77"
              }
            },
          "corrections":{} 
        };
    
    const config ={
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    const testUrl = base_url + 'api/receipt?userId='+ userId;
    request(testUrl, config, (json) => { console.log(json)});
  });
      //db.receipts.find({ '_id': '5e456391-e0f3-11e7-98f7-6dde4cc7e29e'})


  it('Test api/receipts update responds with correct status code 200' , () => {
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
          },
      };
    
    const config ={
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    const testUrl = base_url + 'api/receipt?receiptId='+ receiptId;
    request(testUrl, config, (json) => console.log(json));
    
  });
});
