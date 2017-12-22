const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');


exports.addClientHandler = (req, res) => {
  // 
  if (!req.query.userId) return console.error('no userId');
  const { userId } = req.query;
  const { guests, corrections, client, Belegart } = req.body;
  const _id = uuidv1();
  console.log('ADDING A USER MANUALLY', req.body); 
  
  const listings = [ 
    ...Object.values(guests || {}),
    ...Object.values(corrections || {}) 
    ].map(record =>{
    return {
        ...client,
        ...record,
        filename: 'manual entry',
        userId,
        created: DATETIMESTAMP,
        clientId: client['Kunden-nummer'],
        Rechnungsnummer: uuidv1(),
        Belegart,
        _id: uuidv1()
    };
  });
  ReceiptDB.insertMany(listings, err => {
      if(err) { 
        console.log('ADDING A USER MANUALLYcADDED receipts', req.body); 
          return res.json( { message: err });
      } else {       
          const newCustomer = {
             ...client,
            Belegart,
            created: DATETIMESTAMP,
            listings: listings.map(listing => listing._id),
            _id: client['Kunden-nummer'] || uuidv1(),
            Rechnungsnummer: Number(client['Rechnungsnummer']) || 0,
            'Rechnungs-datum': client['Rechnungs-datum'] || Date(),
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
  console.log(req.body);
  // const { type, guests, client, corrections } = req.body;
  // const { receiptId } = req.query;
  // if (!receiptId) return console.error('no receiptId');
  // //const billType = type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X'};
  // ReceiptDB.findByIdAndUpdate(receiptId, client, (err, model) => {
  //     if(err) {
  //         console.error(err);
  //         return res.json({ message: err });
  //     }
  //     res.json({ message: 'client has been updated', model : {...model, ...client} });
  // });
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
  const { month } = req.query;
  const currentYear = new Date().getFullYear();
  
  let toMonth = month;
  let toYear = currentYear;
  if (month == 11) {
    toMonth = 0;
    toYear ++;
  } else {
    toMonth ++;
  }
  const fromDate =  new Date(currentYear, Number(month), 1).getTime();
  const toDate = new Date(toYear, Number(toMonth), 1).getTime();  

  let query = {
    created: {
     '$gte': fromDate,
     '$lt': toDate
    }
  };
  
  new Promise((resolve, reject) => {
    ClientDB.find( query )
      .limit(50)
      .sort({ created: -1 })
      .exec((err) => {
        if (err) return reject(err);
      }).then((clients) => {
         ReceiptDB.find(query)
          .exec((err, receipts) => {
            if (err) return reject(err);
            const output = clients.map(client => {
              const newListings = client.listings.map(listing => {
                const receiptIndex = receipts.map(receipt => receipt._id).indexOf(listing);
                return receipts[receiptIndex];
              });
              client.listings = [...newListings];
              return client;
            });
            res.json(output);
          });
      }).catch(err =>{
        res.json({message: err});
      });
  });


};
