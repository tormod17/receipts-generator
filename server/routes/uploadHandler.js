const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const { formatDate, getDateQuery, findTransactionsByIds, createTransactionList } = require('../helpers/helpers');
const { createInvoiceExistingClient, createNewInvoiceAndClient, updateInvoiceTrans } = require('../helpers/database');

const xlsx = require('xlsx');
const uuidv4 = require('uuid/v4');
const DATETIMESTAMP = Date.now();

exports.uploadHandler = (req, res, next) => {
  const { file, query } = req;
  const { userId } = query;
  if (!file) return res.json({ message: 'err_desc: No file passed' });
  
  const { originalname, filename } = file;
  const ext = originalname
    .split('.')[originalname.split('.').length - 1];

  const acceptedExtension = ['xlsx', 'csv', 'xlsm']

  if (!acceptedExtension.includes(ext)) return res.json({message: 'incorrect file type'});
    
  const workbook = xlsx.read(file.buffer);
  const sheet_name_list = workbook.SheetNames;
  const jsonResults = xlsx.utils
    .sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  const transactions = createTransactionList(jsonResults, filename)
  // Add transactions to each customer.
  const customers = transactions.reduce((p, c) => {
    p[c['Kundennummer']] = {
      ...c,
      _id: c['Kundennummer'],
      transactions: transactions.filter(bill => bill['Kundennummer'] === c['Kundennummer']),
      created: DATETIMESTAMP,
      Belegart: c['Auszahlung'] === 'x' ? 'Auszahlung': 'Rechnung',
      Rechnungsdatum: formatDate(c['Rechnungsdatum']) || DATETIMESTAMP
    };
    return p;
  }, {});

  const invPromises = Object.values(customers).map(client => {
    return new Promise((resolve, reject) => {
      const month =  new Date(Number(client['Rechnungsdatum'])).getMonth();
      const year = new Date(Number(client['Rechnungsdatum'])).getFullYear();
      const dateQuery = getDateQuery(month, year);
      //find invoices by month and client id. 
      InvoiceDB
        .find({clientId: client['Kundennummer']})
        .exec()
        .then(invoices => {
          //console.log(invoices, 'This should be a list of invoices');
          const newInvoice = {
            ...client,
            clientId: client['Kundennummer'],
            Rechnungsdatum: client['Rechnungsdatum'],
            transactions: [ ...client.transactions ],
            Rechnungsnummer: (invoices.length + 1),
            _id: uuidv4()
          };
          if(invoices.length) {
            const { $lt, $gte }  = dateQuery.Rechnungsdatum;
            const invoiceInDateRange = invoices.filter(inv => inv.Rechnungsdatum > $gte && inv.Rechnungsdatum  < $lt);
            if (invoiceInDateRange.length > 0) {  
              // update invoice with new transactions.
              updateInvoiceTrans(invoiceInDateRange[0], newInvoice.transactions, (err, updatedInvoice) =>{
                if (err) return res.json({message: err +''});
                resolve({
                   ...client,
                   ...updatedInvoice
                })
              })
            } else {
              // create new invoice for existing client
              console.log('Create newInvoice for existing client');
              createInvoiceExistingClient(newInvoice, newInvoice.transactions, (err, updatedInvoice) => {
                if (err) return res.json({message: err +''});
                resolve({
                   ...client,
                   ...updatedInvoice
                })
              });
            }
          } else {
            // Check if client exist without invoice
            ClientDB
              .find({_id: client._id})
              .then(existingClient => {
                if (existingClient) {
                  /// Only new Invoice.
                  createInvoiceExistingClient(newInvoice, newInvoice.transactions, (err, updatedInvoice) => {
                    if (err) return res.json({message: err +''});
                    resolve({
                       ...existingClient,
                       ...updatedInvoice
                    })
                  });
                } else {
                  //create new client and new invoice.
                  console.log('Create new Invoice and client');
                  createNewInvoiceAndClient(newInvoice, newInvoice.transactions, client, (err, updatedInvoice) => {
                    if (err) return res.json({message: err +''});
                    resolve({
                       ...client,
                       ...updatedInvoice
                    });
                  })
                }
              })
              .catch(err => {
                reject(err);
              })          
          }
        })
        .catch(err => {
          reject(err);
        })
    });
  });
  Promise.all(invPromises)
    .then(invs => { // an array of objects
      const newIvoices = invs.reduce((p, c) => {
        p[c._id] = { ...c };
        return p;
      }, {});
      res.json({ 
        invoices: { ...newIvoices }, 
        message: 'entfernt' 
      });
    })
    .catch(err =>{
      res.json({ message: '' + err});
    });
};

