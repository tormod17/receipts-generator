const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');
const { splitDuplicatesUniques } = require('./helpers');

exports.updateInvoice = (invoice, newTrans, cb) => {
  invoice.transactions = [ ...invoice.transactions, ...newTrans];
  /// updateInvoice check to see if receipts already exist. before adding.
  InvoiceDB.findByIdAndUpdate(invoice._id, invoice, { new: true })
    // check every transaction in that invoice for duplicates.
    .then(updatedInv => {
        ReceiptDB.insertMany(newTrans)      
        .then((success) => {
          // if you update the same invoice with the same transactions then it should double up 
          cb(null, updatedInv._doc)
        })
    })
    .catch(err =>{
      cb(err)
    })
}


exports.createNewInvoiceAndClient = (newInvoice, client, cb) => {
  InvoiceDB.create(newInvoice)
    .then(() => {
      ReceiptDB.insertMany(newInvoice.trans)
        .then(() => {
          ClientDB.create(client)
            .then(() => {
              cb(null, newInvoice)
            })
        });
    })
    .catch(err => {
      cb(err);
    })
}


exports.createNewInvoice = (newInvoice, cb ) => {
  InvoiceDB.create(newInvoice)
    .then(() => {
      ReceiptDB.insertMany(newInvoice.transactions)
        .then(() => {
          cb(null, newInvoice)
        })
    })
    .catch(err => {
      cb(err);
    })
}