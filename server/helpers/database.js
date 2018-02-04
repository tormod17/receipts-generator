const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

exports.updateInvoiceTrans = (invoice, newTrans, cb) => {
  // get all transactions
  invoice.transactions = [ ...invoice.transactions, ...newTrans];
  InvoiceDB.findByIdAndUpdate(invoice._id, invoice, { new: true })
    .then(updatedInvoice => {
        ReceiptDB.insertMany(newTrans)      
      })
      .then(updatedInvoice => {
        cb(null, invoice)
      })
      .catch(err =>{
        cb(err)
      })
}

exports.createInvoiceExistingClient = (invoice, trans, cb) => {
  InvoiceDB.create(invoice)
    .then(() => {
      ReceiptDB.insertMany(listings)
        .then(() => {
          // Return new invoice, with new transaction return client details
          cb(newInvoice)
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
              cb(null, newInvoice)
            })
        });
    })
    .catch(err => {
      cb(err);
    })
}