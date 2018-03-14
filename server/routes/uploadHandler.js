const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const { formatDate, getDateQuery, findTransactionsByIds, createTransactionList } = require('../helpers/helpers');
const { createInvoiceExistingClient, createNewInvoiceAndClient, updateInvoice, createNewInvoice } = require('../helpers/database');

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
  // Add transactions to each invocice.
  let invoices = []
  transactions.forEach(t => {
    if (!invoices.find(inv => inv.Kundennummer === t.Kundennummer)) {
      invoices.push({
        PLZ: t.PLZ,
        Stadt: t.Stadt,
        Straße: t.Straße,
        Emailadresse: t.Emailadresse,
        Kundennummer: t.Kundennummer,
        Kunde: t.Kunde,
        transactions: transactions.filter(trans => trans['Kundennummer'] === t['Kundennummer']),
        clientId: t.Kundennummer,
        created: DATETIMESTAMP,
        Belegart: t['Auszahlung'].toUpperCase() === 'X' ? 'Auszahlung': 'Rechnung',
        Rechnungsdatum: formatDate(t['Rechnungsdatum']) || DATETIMESTAMP
      })
    }
  })

  const invPromises = invoices.map(invoice => {
    return new Promise((resolve, reject) => {
      //check if invoice for client exists, either update invoice for client or create new invoice
      var totalCount
      InvoiceDB.count({}).then(invoiceCount => {
        totalCount = invoiceCount
        InvoiceDB.find({clientId: invoice.clientId })
        .exec()
        .then(invoices => {
          // Any invoice exist for said client 
          if(invoices.length) {
            const newInvoice = {
              _id: uuidv4(),
              Rechnungsnummer: totalCount++,
              ...invoice,
            }
            const month =  new Date(Number(invoice['Rechnungsdatum'])).getMonth();
            const year = new Date(Number(invoice['Rechnungsdatum'])).getFullYear();
            const dateQuery = getDateQuery(month, year);
            const { $lt, $gte }  = dateQuery.Rechnungsdatum;
            const currentInv = invoices.filter(inv => inv.Rechnungsdatum > $gte && inv.Rechnungsdatum  < $lt)[0];
            if (currentInv) {
              updateInvoice( currentInv, newInvoice.transactions, (err, updatedInvoice) => {
                if (err) return res.json({message: err + ''});
                resolve({
                  ...updatedInvoice
                })
              })
            } else {
              createNewInvoice(newInvoice, (err, updatedInvoice) => { 
                if (err) return res.json({message: err +''});
                resolve({
                  ...updatedInvoice
                })
              })
            }
          } else {
            const newInvoice = {
              _id: uuidv4(),
              Rechnungsnummer: totalCount++,
              ...invoice,
            }
            createNewInvoice(newInvoice, (err, updatedInvoice) => {
              if (err) return res.json({message: err +''}); 
              resolve({
                ...updatedInvoice
              })
            })
          }
        })
      });
    });
  });
  Promise.all(invPromises)
    .then(invs => {
      const newInvoices = invs.reduce((p,c) => {
        p[c._id] = { ...c };
        return p;
      }, {})
      res.json({ 
        invoices: { ...newInvoices }, 
        message: 'entfernt' 
      })
    })
    .catch(err =>{
      res.json({ message: '' + err});
    });
}



