require ('isomorphic-fetch');
//const { addReceipt } = require ('../../src/actions/clients');

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


describe('clients entry form will respond with the correct payloads', () => {
  it('responds with status 200 from clients endpoint', () => {
    const config ={
      method: 'get',
    };

    const testUrl = base_url + 'api/clients?userId='+ userId;
    request(testUrl, config, () => {});
  });

  it.only('Test api/client post responds with correct status code 200' , () => {
      const userId ='5a327139dd4b790d7d17e0e5';

      const data =    { 
        customer: { 
          Kunde: 'Tormod Smith',
          Emailadresse: 'tormodsmith@gmail.com',
          'Straße': 'Flat 205',
          Stadt: 'London',
          PLZ: 'SW3 3DS' ,
          'Kunden-nummer': '100443'

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

  it.only('Test api/client post responds with correct status code 200' , () => {
      const userId ='5a327139dd4b790d7d17e0e5';
      const data =    { 
        customer: { 
          Kunde: 'Tormod Smith',
          Emailadresse: 'tormodsmith@gmail.com',
          'Straße': 'Flat 205',
          Stadt: 'London',
          PLZ: 'SW3 3DS' ,
          'Kunden-nummer': '1003'
        },
        guests:{ 
          'df571922-ffc6-4c2a-803f-f5ac5b8c48a3': { 
            'Name des Gastes': 'Mini Mouse'
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
    request(testUrl, config, (json) => { console.log(json) });
  });


  it.only('Test api/client post responds with correct status code 200' , () => {
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

    const testUrl = base_url + 'api/clients?receiptId='+ receiptId;
    request(testUrl, config, (json) => console.log(json));
    
  });
});
