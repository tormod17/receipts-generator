const ReceiptDB = require('../models/receipts');
const InvoiceDB = require('../models/invoice');
const { formatDate, getDateQuery, findTransactionsById } = require('../helpers/helpers');


exports.saveMonthHandler = (req, res) => {
  const invoices  = { ...req.body };
  const { month, year } = req.query;
  if (!invoices) return console.error('no client body');

  const updatedInvoices = Object.keys(invoices).map(key => {
    return new Promise((resolve, reject) => {
      InvoiceDB.findByIdAndUpdate( key, { locked: true }, { new: true}, (err, model) =>{
        if (err) return reject(err);
        resolve(model);
      });
    });
  });
  Promise.all(updatedInvoices)
    .then((currentInvoices) => {
      const invObj = currentInvoices.reduce((p,c) => {
        p[c._id] = {
          ...c._doc,
          ...invoices[c._id],
          'Rechnungs-datum': Number(c['Rechnungs-datum']),
          transactions: [ ...invoices[c._id].transactions ].filter(trans => trans !== null)
        };
        return p;
      }, {});
   
      res.json({
        invoices: {
          ...invObj
        },
        message: 'Gerettet'
      });
    })
    .catch((err) => {
      res.json({ message: '' + err});
    });
};
