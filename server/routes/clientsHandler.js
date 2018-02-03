const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');
const { formatDate, getDateQuery, findTransactionsByIds } = require('../helpers/helpers');

exports.addClientHandler = (req, res) => {
  if (!req.query.userId && !client) return console.error('no userId'); 
  const { userId } = req.query;
  const { guests, corrections, client, Belegart } = req.body;
  client._id = client['Kundennummer'];

  console.log('ADDING A USER MANUALLY'); 

  const month =  new Date(Number(client['Rechnungsdatum'])).getMonth();
  const year = new Date(Number(client['Rechnungsdatum'])).getFullYear();

  const transactions = [ 
    ...Object.values(guests || {}),
    ...Object.values(corrections || {}) 
    ];

  const listings = transactions.map(record =>{
    const dates = {};

    if (record['Rechnungsdatum']) {
        dates['Rechnungsdatum'] = formatDate(record['Rechnungsdatum'])|| DATETIMESTAMP;
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
        clientId: client['Kundennummer'],
        ...dates,
        Belegart
    };
  });

const transactionsKeys = transactions.map(trans => trans._id);
const dateQuery = getDateQuery(month, year);

// Check invoice for given month. 
  InvoiceDB
    .find({clientId: client['Kundennummer']})
    .exec()
    .then(invoices => {
      const newInvoice = {
        _id: uuidv1(),
        clientId: client['Kundennummer'],
        Rechnungsdatum: client['Rechnungsdatum'],
        transactions: transactionsKeys,
        Rechnungsnummer: (invoices.length + 1),
        Belegart
      };
      console.log(invoices.length, 'Are there Invoices with that client Id');
      if(invoices.length) {
         
        const { $lt, $gte }  = dateQuery.Rechnungsdatum;
        const invoicesInDateRange = invoices.filter(inv => inv.Rechnungsdatum > $gte && inv.Rechnungsdatum  < $lt).length
        if (invoicesInDateRange) {
          return res.json({
            message: 'Diese Kundennummer existiert bereits',
            invoice: {} 
          });
        } else  {
          // Create new invoice for this month
          console.log('Create new invoice for existing client for new month.');
          InvoiceDB.create(newInvoice)
            .then(() => {
              ReceiptDB.insertMany(listings)
                .then(()=> {
                  // Return new invoice, with new transaction return client details
                  ClientDB.findById(client._id)
                    .then((savedClient) =>{
                      newInvoice['transactions'] = listings.map(listing => {
                        if (newInvoice.transactions.includes(listing._id)){
                          return listing;
                        }
                      });
                      console.log({
                        ...savedClient,
                        ...newInvoice
                      });
                      res.json({
                        message: 'entfernt',
                        invoice: {
                          ...savedClient,
                          ...newInvoice
                        }
                      })
                    })
                })
            })
        }
      } else {
        console.log('Create new invoice and client');
        InvoiceDB.create(newInvoice)
          .then(() => {
              ReceiptDB.insertMany(listings)
              .then(() => {
                  ClientDB.create(client)
                    .then(() => {
                      newInvoice['transactions'] = listings.map(listing => {
                        if (newInvoice.transactions.includes(listing._id)){
                          return listing;
                        }
                      });
                      res.json({
                        message: 'entfernt',
                        invoice: {
                          [newInvoice._id]: {
                            ...client,
                            ...newInvoice
                          }
                        }
                      });
                    })                   
                  });
            })
      }
    })
    .catch(err => {
      res.json({message: err +''});
    })
}

exports.updateInvoiceHandler = (req, res) => {
  // needs to only update the receipt details not client
  const { Belegart, guests, client, corrections } = req.body;
  const { invoiceId } = req.query;

  const listings = [ ...Object.values(guests), ...Object.values(corrections) ];  
    if(!client && invoiceId ) return  res.json({ message: 'fail no invoice Id or client details' });
      client.Belegart = Belegart;
      // we only store array of Ids not objects (better for parsing)
      client.listings = listings.map(listing => listing._id); 

      const updatedInvoice = {
        _id: invoiceId,
        Belegart,
        clientId: client.clientId,
        'Rechnungsnummer': client['Rechnungsnummer'],
        'Rechnungsdatum': client['Rechnungsdatum'],
        transactions: [...client.listings]
      };
      const updatedClient = {
        PLZ: client.PLZ,
        Stadt: client.Stadt,
        Straße: client.Straße,
        Emailadresse: client.Emailadresse
      };
      // update invoice
      InvoiceDB.findByIdAndUpdate(invoiceId, updatedInvoice)
        .then(() => {
          //update listings
          const updatedTransactions = listings.map(listing => {
            return new Promise((resolve, reject) => {
              ReceiptDB.findByIdAndUpdate(listing._id, listing, { new: true }, (err, model) => {
                if (err) return reject(err);
                if (!model) {
                  listing.created = DATETIMESTAMP;
                  listing.Belegart = Belegart;
                  listing['Rechnungsdatum'] = Number(client['Rechnungsdatum']);
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
          return Promise.all(updatedTransactions);
        })
        .then(() => {
          // update client
          ClientDB.findByIdAndUpdate(client._id, updatedClient, { new: true}, err => {
            if (err) return res.json({message: err +''});
            client.listings = [...listings];
            res.json({ 
              message: 'entfernt',
              invoice: { 
                [invoiceId]: {
                  ...client
                }
              }
            });
          });
        })
        .catch(err => {
          res.json({message: err +''});
        });
};

exports.delClientHandler = (req, res) => {
  if (!req.body) return console.error('no body to request');
  const ids = [...req.body];
  const promises = ids.map( id => {
    return new Promise((resolve, reject) => {
        InvoiceDB.deleteOne({ _id: id }, (err) => {
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
                  //if(!invoice) return reject()
              
                  const newInvoice = {
                    ...client._doc,
                    ...invoice._doc,
                    transactions: [ ...trans]
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
          const newIvoices = invs.reduce((p, c) => {
            p[c._id] = {
              ...c
            };
            return p;
          }, {});
          res.json({ 
            invoices: { ...newIvoices }, 
            message: 'entfernt' 
          });
        })
        .catch((err)=>{
          res.json({ message: '' + err});
        });
    });
};
