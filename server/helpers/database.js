const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice')

exports.updateInvoice = (invoice, newTrans, cb) => {
  invoice.transactions = [ ...invoice.transactions, ...newTrans];
  InvoiceDB.findByIdAndUpdate(invoice._id, invoice, { new: true })
    .then(updatedInv => {
        ReceiptDB.insertMany(newTrans)      
        .then(() => {
          cb(null, updatedInv)
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
      ReceiptDB.insertMany(newInvoice.trans)
        .then(() => {
          cb(null, newInvoice)
        })
    })
    .catch(err => {
      cb(err);
    })
}