const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');
const { formatDate } = require('../helpers/helpers');

exports.addClientHandler = (req, res) => {
  // 
  if (!req.query.userId) return console.error('no userId');
  const { userId } = req.query;
  const { guests, corrections, client, Belegart } = req.body;
  console.log('ADDING A USER MANUALLY'); 
  
  const listings = [ 
    ...Object.values(guests || {}),
    ...Object.values(corrections || {}) 
    ].map(record =>{
    const dates = {};
    if (record['Rechnungs-datum']) {
        dates['Rechnungs-datum'] = formatDate(record['Rechnungs-datum'])|| DATETIMESTAMP;
    }
    if (record['Anreisedatum']) {
        dates['Anreisedatum'] = formatDate(record['Anreisedatum'])|| DATETIMESTAMP;
    } 
    if (record['Abreisedatum (Leistungsdatum)']) {
        dates['Abreisedatum (Leistungsdatum)'] = formatDate(record['Abreisedatum (Leistungsdatum)']);
    }
    return {
        ...client,
        ...record,
        filename: 'manual entry',
        userId,
        created: DATETIMESTAMP,
        clientId: client['Kunden-nummer'],
        Rechnungsnummer: uuidv1(),
        ...dates,
        Belegart,
        _id: uuidv1()
    };
  });
  ReceiptDB.insertMany(listings, err => {
      if(err) { 
        console.log('ADDING A USER MANUALLYcADDED receipts'); 
          return res.json( { message: err });
      } else {       
          const newCustomer = {
             ...client,
            Belegart,
            created: DATETIMESTAMP,
            listings: listings.map(listing => listing._id),
            _id: client['Kunden-nummer'] || uuidv1(),
            Rechnungsnummer: Number(client['Rechnungsnummer']) || 0,
            'Rechnungs-datum': formatDate(client['Rechnungs-datum'])|| DATETIMESTAMP,
            'FR': 0
          };
          /// Client Numbers must be decided before otherwise will update a previous customer
          //  Difference between updating an existing client that doesn't have an entry that month and new client
          ClientDB.findById(newCustomer._id,(err, savedClient) => {
            if (savedClient){
                savedClient['Emailadresse']=  newCustomer['Emailadresse'],
                savedClient['Kunde']=  newCustomer['Kunde'],
                savedClient['Stadt']=  newCustomer['Stadt'],
                savedClient['Straße']=  newCustomer['Straße'],
                savedClient['PLZ']=  newCustomer['PLZ'],
                savedClient['Kunden-nummer']= newCustomer['Kunden-nummer'],
                savedClient['_id']=  newCustomer['Kunden-nummer'],
                savedClient['listings'] = [...savedClient.listings, ...newCustomer.listings];
                savedClient['Belegart'] = newCustomer['Belegart'],
                savedClient['FR'] = newCustomer['FR'],
                savedClient['Rechnungs-datum'] = newCustomer['Rechnungs-datum'],
                savedClient['Rechnungsnummer'] = Number(newCustomer['Rechnungsnummer']) ,
                savedClient.save((err, savedClient)=>{
                    if (err) {
                      res.json({message: err});
                    } else {
                      const newClient ={ 
                        [newCustomer['_id']]: {
                          ...newCustomer,
                          listings: [ ...listings]
                        }
                      };
                      console.log(savedClient, 'update new  client for month !!!!!!!');
                      res.json(newClient);
                    } 
                });
            } else {
                ClientDB.create( newCustomer, (err, savedClient) => {
                  if (err) {
                    res.json({message: err});
                  } else {
                    console.log(savedClient, ' saved new  client !!!!!!!');
                    const newClient = {
                      [newCustomer._id]:{
                        ...newCustomer,
                        listings: [ ...listings]
                      }
                    };
                    res.json(newClient);
                  } 
                });
            }
           
        });
      }
  });
};

exports.updateClientHandler = (req, res) => {
  // needs to only update the receipt details not client
  const { Belegart, guests, client, corrections } = req.body;
  
  const listings = [ ...Object.values(guests), ...Object.values(corrections) ];  
    if(client) {
      client.Belegart = Belegart;
      // we only store array of Ids not objects (better for parsing)
      client.listings = listings.map(listing => listing._id); 
      client['Rechnungs-datum']= formatDate(client['Rechnungs-datum']) || DATETIMESTAMP,

      ClientDB.findByIdAndUpdate(client._id, client, { new: true}, (err, newClient)=> {
          if (err) return res.json({message: err +''});
          const promises = listings.map(listing => {
            return new Promise((resolve, reject) => {
              ReceiptDB.findByIdAndUpdate(listing._id, listing, { new: true }, (err, model) => {
                if (err) return reject(err);
                if (!model) {
                  listing.created = DATETIMESTAMP;
                  listing.Belegart = Belegart;
                  listing['Rechnungs-datum'] = client['Rechnungs-datum'];
                  ReceiptDB.create(listing, err => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(listing);
                    }                 
                  });
                } else {
                  resolve(model);
                }
              });
            }); 
          });
          Promise.all(promises)
            .then(newListings => {
              const updatedClient = {
                [newClient['Kunden-nummer']] : {
                  'Emailadresse':  newClient['Emailadresse'],
                  'Kunde':  newClient['Kunde'],
                  'Stadt':  newClient['Stadt'],
                  'Straße':  newClient['Straße'],
                  'PLZ':  newClient['PLZ'],
                  'Kunden-nummer': newClient['Kunden-nummer'],
                  '_id':  newClient['Kunden-nummer'],
                  'listings': newListings,
                  'Belegart': newClient['Belegart'] || Belegart,
                  'Rechnungsnummer': newClient['Rechnungsnummer'],
                  'Rechnungs-datum': newClient['Rechnungs-datum'],
                  'FR': newClient['FR']
                }
              };
              res.json({ 
                message: 'entfernt',
                client: {
                  ...updatedClient
                }
              });
            })
            .catch(err =>{
              res.json({ message: '' + err});
            });
      });
  } else  {
    res.json({message: 'error'});
  }
};


exports.delClientHandler = (req, res) => {
  if (!req.body) return console.error('no body to request');
  const ids = [...req.body];
  const promises = ids.map( id => {
    return new Promise((resolve, reject) => {
        ClientDB.deleteOne({ _id: id }, (err) => {
        if (err) reject(err);
      }).then(() => {
        ReceiptDB.remove({clientId: id}, (err) => {
          if (err) reject(err);
          resolve();          
        });
      });
    });
  });
  Promise.all(promises)
    .then(res.json({ 
        data: ids, 
        message: 'entfernt' 
    }))
    .catch((err)=>{
      res.json({ message: '' + err});
  });
};

exports.getClientsHandler = (req, res) => {
  /// needs to accept time parameters
  if (!req.query) return console.error('no userId');
  const { month, year } = req.query;
  let toMonth = Number(month) + 1;
  let toYear = year;
  
  if (toMonth === 12) {
    toMonth = 0;
    toYear = Number(toYear) + 1;
  } 

  const fromDate =  new Date(year, Number(month), 1).getTime();
  const toDate = new Date(toYear, Number(toMonth), 1).getTime();  

  let query = {
    'Rechnungs-datum': {
     '$gte': fromDate,
     '$lt': toDate
    }
  };
  ReceiptDB.find(query) // why is this only getting John Berrie if by range
   .exec((err, transactions) => {
      let clientSet = new Set();
      transactions.forEach(receipt => {
        clientSet.add(receipt._doc.clientId);
      });
      ClientDB.find({
        '_id': {
          '$in': [...clientSet]
        }
      }, (err, clients) => {
          if (err) return res.json({message: err});
          const results = clients.map(client => {
            client.listings = client.listings.map(id =>
              transactions.find((trans) => trans._id === id)
            );
            return client;
          });
          res.json(results);
      });
    });
};
