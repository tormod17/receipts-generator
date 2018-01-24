const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');
const { formatDate, getDateQuery } = require('../helpers/helpers');

exports.addClientHandler = (req, res) => {
  // Check if customer already exists 
  if (!req.query.userId && !client) return console.error('no userId'); 
  const { userId } = req.query;
  const { guests, corrections, client, Belegart } = req.body;
  client._id = client['Kunden-nummer'];

  console.log('ADDING A USER MANUALLY'); 

  const month =  new Date(Number(client['Rechnungs-datum'])).getMonth();
  const year = new Date(Number(client['Rechnungs-datum'])).getFullYear();

  const transactions = [ 
    ...Object.values(guests || {}),
    ...Object.values(corrections || {}) 
    ];

  const listings = transactions.map(record =>{
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
        ...dates,
        Belegart
    };
  });

const transactionsKeys = transactions.map(trans => trans._id);
const dateQuery = getDateQuery(month, year);


ReceiptDB.insertMany(listings, err => {
  if(err) { 
      return res.json( { message: err });
  } else {   
    InvoiceDB.find(dateQuery)
      .where('clientId').equals(client['Kunden-nummer'])
      .exec((err, invoice) => {
          if(invoice.length) {
           // update invoice with more transactions. 
            console.log('invoice update >>>>');
            const currentInvoice = { ...invoice[0] };
            currentInvoice.transactions =  [...invoice[0].transactions, ...transactionsKeys];
            InvoiceDB.update({_id: currentInvoice._id }, currentInvoice, err => {
            if (err) return res.json({ message: err });
            res.json({
              message: 'entfernt',
              client: {
                ...currentInvoice
              }
            });
          });
                  
         } else {
          // Create a new Invoice 
          InvoiceDB.find({ clientId: invoice.clientId}).exec((err, invoices) => {
            const newInvoice = {
              _id: uuidv1(),
              clientId: client['Kunden-nummer'],
              'Rechnungs-datum': client['Rechnungs-datum'],
              transactions: transactionsKeys,
              'Rechnungs-nummer': (invoices.length + 1),
              Belegart
            };
            console.log(newInvoice);
            if (invoices.length) {  
                console.log('New invoice only');
                // Only Invoice and add increment
                InvoiceDB.create(newInvoice, err => {
                newInvoice['transactions'] = listings.map(listing => {
                  if (newInvoice.transactions.includes(listing._id)){
                    return listing;
                  }
                });
                res.json({
                  message: 'entfernt',
                  invoice: {
                    ...client,
                    ...newInvoice
                  }
                });
              });   
            } else {
              // new invoice and client
              InvoiceDB.create(newInvoice, err => {
                if (err) return res.json({ message: err });
                ClientDB.create(client, err => {
                  if (err) return res.json({ message: err });
                  console.log('New invoice and Client', newInvoice.transactions, listings);
                  newInvoice['transactions'] = listings.map(listing => {
                    if (newInvoice.transactions.includes(listing._id)){
                      return listing;
                    }
                  });
                  res.json({
                    message: 'entfernt',
                    invoice: {
                      ...client,
                      ...newInvoice
                    }
                  });
                });
              });  
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
      client['Rechnungs-datum']= Number(formatDate(client['Rechnungs-datum']) || DATETIMESTAMP),
      ClientDB.findByIdAndUpdate(client._id, client, { new: true}, (err, newClient)=> {
          if (err) return res.json({message: err +''});
          const promises = listings.map(listing => {
            return new Promise((resolve, reject) => {
              ReceiptDB.findByIdAndUpdate(listing._id, listing, { new: true }, (err, model) => {
                if (err) return reject(err);
                if (!model) {
                  listing.created = DATETIMESTAMP;
                  listing.Belegart = Belegart;
                  listing['Rechnungs-datum'] = Number(client['Rechnungs-datum']);
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
  // get invoices in a date range
  InvoiceDB.find(getDateQuery(month, year)) 
    .exec((err, invoices) => {
      // for each invoice get all their invoices. 
      const invPromises = invoices.map( invoice => {
        return new Promise((resolve, reject) => {
          ClientDB.findById(invoice.clientId)
            .then(client => {
              ReceiptDB.find({ clientId: invoice.clientId})
                .exec((err, trans) => {
                  if (err) return reject(err);
                  console.log(client._doc);
                  const newInvoice = {
                    ...client._doc,
                    ...invoice._doc,
                    listings: [ ...trans]
                  };
                   resolve(newInvoice);
                });
            })
            .catch(err => {
              reject(err);
            });
        });
      });
      Promise.all(invPromises)
        .then(invs => {
          res.json({ 
            invoices: [...invs], 
            message: 'entfernt' 
          });
        })
        .catch((err)=>{
          res.json({ message: '' + err});
        });
    });
};
