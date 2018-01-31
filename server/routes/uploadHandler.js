const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const InvoiceDB = require('../models/invoice');

const { formatDate, getDateQuery, findTransactionsByIds } = require('../helpers/helpers');
const xlsx = require('xlsx');
const uuidv1 = require('uuid/v1');
const DATETIMESTAMP = Date.now();

exports.uploadHandler = (req, res, next) => {
  const { file, query } = req;
  const { userId } = query;
  if (!file) {
    return res.json({ message: 'err_desc: No file passed' });
  }
  const { originalname, filename } = file;
  const ext = originalname
    .split('.')[originalname.split('.').length - 1];

  if (ext === 'xlsx' || ext === 'csv' || ext === 'xlsm') {
    const workbook = xlsx.read(file.buffer);
    const sheet_name_list = workbook.SheetNames;
    const jsonResults = xlsx.utils
      .sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const listings = jsonResults.map(record => {
      const uuid = uuidv1();
      const dates = {
        'Rechnungs-datum': formatDate(record['Rechnungs-datum']) || DATETIMESTAMP
      };
      if (record['Anreisedatum']) {
        dates['Anreisedatum'] = formatDate(record['Anreisedatum']);
      }
      if (record['Abreisedatum (Leistungsdatum)']) {
        dates['Abreisedatum (Leistungsdatum)'] = formatDate(record['Abreisedatum (Leistungsdatum)']);
      }
      const newrecord = {
        ...record,
        filename,
        userId,
        created: DATETIMESTAMP,
        clientId: record['Kunden-nummer'],
        ...dates,
        _id: uuid
      };
      return newrecord;
    });
  
    const customers = listings.reduce((p, c) => {
      p[c['Kunden-nummer']] = {
        ...c,
        _id: c['Kunden-nummer'],
        transactions: listings.filter(bill => bill['Kunden-nummer'] === c['Kunden-nummer']).map(bill => bill._id),
        created: DATETIMESTAMP,
        Belegart: (c['Auszahlung'] && 'Auszahlung' || c['Rechnung'] && 'Rechnung'),
        'Rechnungs-datum': formatDate(c['Rechnungs-datum']) || DATETIMESTAMP
      };
      return p;
    }, {});

    ReceiptDB.insertMany(listings, (err, newListings) => {
        if (err) {
          return res.json({ message: err });
        } else {      
          const invPromises = Object.values(customers).map(client => {
              return new Promise((resolve, reject) => {
                const month =  new Date(Number(client['Rechnungs-datum'])).getMonth();
                const year = new Date(Number(client['Rechnungs-datum'])).getFullYear();
                const dateQuery = getDateQuery(month, year);

                InvoiceDB.find(dateQuery)
                  .where('clientId').equals(client['Kunden-nummer'])
                  .exec((err, invoice) => {
                      if(invoice.length) {
                        // update invoice with more transactions also need to return existing 
                        // transactions for each invoice. 
                        const currentInvoice = { ...invoice[0]._doc };
                        const allTrans = [currentInvoice.transactions, ...client.transactions].map(trans => {
                          return new Promise((resolve, reject) => {
                            ReceiptDB.findById(trans)
                              .then( newtrans => {
                                resolve(newtrans);
                              })
                              .catch(err => {
                                reject(err);
                              });
                          });
                        });
                        Promise.all(allTrans)
                          .then(trans => {
                            InvoiceDB.findByIdAndUpdate( currentInvoice._id, currentInvoice, { new: true},  err => {
                                if (err) return resolve(err);
                                resolve({
                                  ...client,
                                  ...currentInvoice,
                                  transactions: [...trans]
                                });
                            });  
                          })
                          .catch(err => {
                            reject(err);
                          });
                     } else {
                      // Create a new Invoice 
                      InvoiceDB.find({ clientId: invoice.clientId}).exec((err, invoices) => {
                        const newInvoice = {
                          _id: uuidv1(),
                          clientId: client['Kunden-nummer'],
                          'Rechnungs-datum': client['Rechnungs-datum'],
                          transactions: client.transactions,
                          'Rechnungs-nummer': (invoices.length + 1),
                          Belegart: client.Belegart
                        };
                        if (invoices.length) {  
                            // Only Invoice and add increment
                          InvoiceDB.create(newInvoice, err => {
                            if (err) return resolve(err);
                            newInvoice['transactions'] = findTransactionsByIds(newListings, newInvoice);
                            resolve({...newInvoice });
                          });   
                        } else {
                          // new invoice and client already exists as invoice with client Id exists.
                          InvoiceDB.create(newInvoice, err => {
                            if (err) return reject(err);
                            ClientDB.findByIdAndUpdate(client._id, client, err => {
                              if (err) return reject(err);
                              newInvoice['transactions'] = findTransactionsByIds(newListings, newInvoice);
                              resolve({
                                ...client,
                                ...newInvoice
                              });
                            });
                          });  
                        }
                      });
                    }
                  });
                }
             );
          });
          Promise.all(invPromises)
            .then(invs => {
              const newIvoices = invs.reduce((p, c) => {
                p[c._id] = {
                  ...c,
                  'Rechnungs-datum': Number(c['Rechnungs-datum'])
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
        }
    });
  } else {
    return res.json({message: 'incorrect file type'});
  }
};

