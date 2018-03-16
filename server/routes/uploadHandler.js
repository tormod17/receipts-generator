const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const { formatDate, getDateQuery, findTransactionsByIds, createTransactionList, splitDuplicatesUniques } = require('../helpers/helpers');
const { createInvoiceExistingClient, createNewInvoiceAndClient, updateInvoice, createNewInvoice } = require('../helpers/database');
const { getText } = require('../language/');

const xlsx = require('xlsx');
const uuidv4 = require('uuid/v4');
const DATETIMESTAMP = Date.now();

exports.uploadHandler = (req, res, next) => {
  const { file, query } = req;
  const { userId } = query;
  if (!file) return res.json({ message: 'err_desc: No file passed' });
  
  const { originalname } = file;
  const ext = originalname
    .split('.')[originalname.split('.').length - 1];

  const acceptedExtension = ['xlsx', 'csv', 'xlsm']

  if (!acceptedExtension.includes(ext)) return res.json({message: 'incorrect file type'});
    
  const workbook = xlsx.read(file.buffer);
  const sheet_name_list = workbook.SheetNames;
  const jsonResults = xlsx.utils
    .sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  const transactions = createTransactionList(jsonResults, originalname)
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
        Belegart: t['Auszahlung'] === 'x' ? 'Auszahlung': 'Rechnung',
        Rechnungsdatum: formatDate(t['Rechnungsdatum']) || DATETIMESTAMP
      })
    }
  })

  ReceiptDB.findOne({ filename: originalname}, (err, result) => {
    if (err) return res.json({ message: '' + err});

    if (result) {
      res.json({ 
        message: getText("FILE.EXIST"), 
      })
    } else {
      const invPromises = invoices.map((invoice, index) => {
        return new Promise((resolve, reject) => {
          //check if invoice for client exists, either update invoice for client or create new invoice
          // Check duplicate file
          InvoiceDB
            .count({}).exec()
            .then(count => {
              return InvoiceDB.find({clientId: invoice.clientId}).exec()
                .then(invoices => {
                  return [count, invoices];
                })
            })
            .then(result => {
              const [count, invoices] = result;
              // Any invoice exist for said client 
              if(invoices.length) {
                const newInvoice = {
                  _id: uuidv4(),
                  Rechnungsnummer: count + (index + 1),
                  ...invoice,
                }
                const month =  new Date(Number(invoice['Rechnungsdatum'])).getMonth();
                const year = new Date(Number(invoice['Rechnungsdatum'])).getFullYear();
                const dateQuery = getDateQuery(month, year);
                const { $lt, $gte }  = dateQuery.Rechnungsdatum;
                const currentInv = invoices.filter(inv => inv.Rechnungsdatum > $gte && inv.Rechnungsdatum  < $lt)[0];
                if (currentInv) {
                  updateInvoice( currentInv, newInvoice.transactions, (err, updatedInvoice) => {
                    if (err) return res.json({message: err +''});
                    console.log('hello updatedInvoice');
                    resolve({
                      ...updatedInvoice
                    })
                  })
                } else {
                  createNewInvoice(newInvoice, (err, updatedInvoice) => { 
                    if (err) return res.json({message: err +''});
                   console.log('hello createNew');
                    resolve({
                      ...updatedInvoice
                    })
                  })
                }
              } else {
                const newInvoice = {
                  _id: uuidv4(),
                  Rechnungsnummer: index + 1,
                  ...invoice,
                }
                console.log('hello createNew');
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
  })
}



