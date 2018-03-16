const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const { getText } = require('../language/');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');
const { formatDate, getDateQuery, findTransactionsByIds, createTransactionList } = require('../helpers/helpers');
const { createNewInvoice, createNewInvoiceAndClient } = require('../helpers/database');

exports.addClientHandler = (req, res) => {
  if (!req.query.userId && !req.body.client) {
    console.error('no userId', req.body); 
    return res.json({ message: 'no client details'});
  }
  const { userId } = req.query;
  const { guests, corrections, client, Belegart } = req.body;
  client._id = client['Kundennummer'];

  console.log('ADDING A USER MANUALLY', client); 

  const month =  new Date(Number(client['Rechnungsdatum'])).getMonth();
  const year = new Date(Number(client['Rechnungsdatum'])).getFullYear();

  const transactions = [ 
    ...Object.values(guests || {}),
    ...Object.values(corrections || {}) 
    ];

  const listings = createTransactionList(transactions, 'manual entry');

  const transactionsKeys = transactions.map(trans => trans._id);
  const dateQuery = getDateQuery(month, year);

  // Get all invoices by client Number
  InvoiceDB
    .count({}).exec()
    .then(count => {
      return InvoiceDB
        .find({clientId: client['Kundennummer']})
        .exec()
        .then(invoices => {
          const newInvoice = {
            ...client,
            _id: uuidv1(),
            clientId: client['Kundennummer'],
            transactions: transactions,
            Rechnungsnummer: (count + 1),
            Belegart
          };
          if(invoices.length) {
            const { $lt, $gte }  = dateQuery.Rechnungsdatum;
            const invoicesInDateRange = invoices.filter(inv => inv.Rechnungsdatum > $gte && inv.Rechnungsdatum  < $lt).length
            if (invoicesInDateRange) {
              return res.json({
                message: getText('CUSTOMER.EXISTS'),
                invoice: {} 
              });
            } else  {
              // Create new invoice for this month
              console.log('Create new invoice for existing client for new month.');
              createNewInvoice(newInvoice, (err, updatedInvoice) => {
                if (err) return res.json({ message: err +'' });
                res.json({
                  message: getText('SUCCESS'),
                  invoice: {
                    [newInvoice._id]: {
                     ...client,
                     ...newInvoice
                    }
                  }
                });
              })
            }
          } else {
            ClientDB
              .findById(client._id)
              .then(savedClient => {
                if (savedClient) {
                  console.log('Create new invoice for existing client no previous invoice');
                  createNewInvoice(newInvoice, (err, updatedInvoice) => {
                    if (err) return res.json({message: err +''});
                    res.json({
                      message: getText('SUCCESS'),
                      invoice: {
                        [newInvoice._id]: {
                         ...client,
                         ...newInvoice
                        }
                      }
                    });
                  })
                } else {
                  console.log('Create new invoice and client'); 
                  createNewInvoiceAndClient(newInvoice, client, (err, updatedInvoice) => {
                    if (err) return res.json({message: err +''});
                    res.json({
                      message: getText('SUCCESS'),
                      invoice: {
                        [updatedInvoice._id]: {
                         ...client,
                         ...updatedInvoice
                        }
                      }
                    });
                  })
                }
              })  
          }
        })
    })
    .catch(err => {
      res.json({message: err +''});
    })

}

exports.updateInvoiceHandler = (req, res) => {
  // needs to only update the receipt details not client
  const { Belegart, guests, client, corrections } = req.body;
  const { invoiceId } = req.query;

  const transactions = [ ...Object.values(guests), ...Object.values(corrections) ];  
    if(!client && invoiceId ) return  res.json({ message: 'fail no invoice Id or client details' });
      client.Belegart = Belegart;
      const newInvoice = {
        PLZ: client.PLZ,
        Stadt: client.Stadt,
        Straße: client.Straße,
        Emailadresse: client.Emailadresse,
        Belegart,
        clientId: client.clientId,
        Rechnungsdatum: client['Rechnungsdatum'],
        transactions: [...transactions],
        _id: invoiceId,
      };
      // update invoice, new transactions need to be added as entities
      InvoiceDB.findById(invoiceId)
        .then(savedInv => {
          // compare transactions
          const savedTransIds = savedInv.transactions.map(trans => trans._id)
          const newTransactions = [...transactions].filter(trans => !savedTransIds.includes(trans._id))
          // check for any new transactions 
          if (newTransactions.length > 0) {
            ReceiptDB.insertMany(newTransactions)
              .catch(err => {
                res.json({message: err +''});
              })
          }
          InvoiceDB.findByIdAndUpdate(invoiceId, newInvoice, { new: true})
            .then((updatedInvoice) =>{
              res.json({
                message: 'entfernt',
                invoice: {
                  [updatedInvoice._doc._id]: {
                    ...updatedInvoice._doc
                  }
                }
              })
            })    
        })
        .catch(err => {
          res.json({message: err +''});
        })

}

exports.delClientHandler = (req, res) => {
  if (!req.body) return console.error('no body to request');
  const ids = [...req.body];

  InvoiceDB.remove({_id: { $in: ids}}, (err, response) => {
    if (err) return res.json({ message: '' + err});
    res.json({
      data: ids, 
      message: getText("DEL")
    })
  })
}

exports.getClientsHandler = (req, res) => {
  /// needs to accept time parameters
  if (!req.query) return console.error('no userId');
  const { month, year } = req.query;
  // get invoices in a date range
  InvoiceDB
    .find(getDateQuery(month, year))
    .exec()
    .then(invs => {
      // for each invoice must get client details
      const newIvoices = invs.reduce((p, c) => {
          p[c._id] = {
            ...c._doc
          };
          return p;
        }, {});
        res.json({ 
          invoices: { ...newIvoices }, 
          message: '' 
        });
    })
    .catch(err => {
      res.json({ message: '' + err});
    })
}


