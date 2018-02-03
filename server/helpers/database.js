const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

exports.createInvoiceExistingClient = (newInvoice, trans, client, cb) => {
  InvoiceDB.create(newInvoice)
    .then(() => {
      ReceiptDB.insertMany(listings)
        .then(() => {
          // Return new invoice, with new transaction return client details
          ClientDB.findById(client._id)
            .then((savedClient) => {
              newInvoice['transactions'] = listings.map(listing => {
                if (newInvoice.transactions.includes(listing._id)) {
                  return listing;
                }
              });
              cb(newInvoice)
            })
        })
    })
    .catch(err => {
      cb(null, err);
    })
}


exports.createNewInvoiceAndClient = (newInvoice, trans, client, cb) => {
  InvoiceDB.create(newInvoice)
    .then(() => {
      ReceiptDB.insertMany(trans)
        .then(() => {
          ClientDB.create(client)
            .then(() => {
              newInvoice['transactions'] = trans.map(listing => {
                if (newInvoice.transactions.includes(listing._id)) {
                  return listing;
                }
              });
              cb(null, newInvoice)
            })
        });
    })
    .catch(err => {
      cb(err);
    })
}