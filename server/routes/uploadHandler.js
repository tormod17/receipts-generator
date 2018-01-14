const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const { formatDate } = require('../helpers/helpers');
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

        const transactions = jsonResults.map(record => {
            const uuid = uuidv1();
            const dates = {
                'Rechnungs-datum': formatDate(record['Rechnungs-datum'])|| DATETIMESTAMP
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

        const customers = transactions.reduce((p, c) => {
            p[ c['Kunden-nummer']] = {
                Emailadresse: c['Emailadresse'],
                Kunde: c['Kunde'],
                Stadt: c['Stadt'],
                Straße: c['Straße'],
                PLZ: c['PLZ'],
                'Kunden-nummer': c['Kunden-nummer'],
                _id: c['Kunden-nummer'],
                listings: transactions.filter(bill => bill['Kunden-nummer'] === c['Kunden-nummer']).map(bill => bill._id),
                created: DATETIMESTAMP,
                Belegart: (c['Auszahlung'] && 'Auszahlung' || c['Rechnung'] && 'Rechnung'),
                Rechnungsnummer: Number(c['Rechnungsnummer']) || 0,
                'Rechnungs-datum': formatDate(jsonResults[0]['Rechnungs-datum'])|| DATETIMESTAMP,
                'FR': 0
            };
            return p;
        }, {}); 
        
        ReceiptDB.insertMany(transactions, err => {
            if(err) { 
                return res.json( { message: err });
            } else {
                const promises = Object.values(customers).map(client => {
                    return new Promise((resolve, reject)=> {
                        ClientDB.findById(client._id,(err, existingClient) => {
                            if (existingClient){
                                existingClient['Emailadresse']=  client['Emailadresse'],
                                existingClient['Kunde']=  client['Kunde'],
                                existingClient['Stadt']=  client['Stadt'],
                                existingClient['Straße']=  client['Straße'],
                                existingClient['PLZ']=  client['PLZ'],
                                existingClient['Kunden-nummer']= client['Kunden-nummer'],
                                existingClient['_id']=  client['Kunden-nummer'],
                                client['listings'].forEach(list => {
                                    existingClient['listings'].push(list);
                                });
                                existingClient['Belegart'] = client['Belegart'],
                                existingClient['Rechnungsnummer'] = client['Rechnungsnummer'],

                                existingClient['FR'] = client['FR'],
                                existingClient.save((err)=>{
                                    if (err) {
                                      reject(err);
                                    } else {
                                      resolve();
                                    } 
                                });
                            } else {
                                ClientDB.create( client, (err) => {
                                  if (err) {
                                    reject(err);
                                  } else {
                                    resolve();
                                  } 
                                });
                            }
                           
                        });
                    });
                });
                Promise.all(promises)
                    .then(() => {
                        Object.keys(customers).forEach(key => {
                            customers[key].listings = transactions.filter(listing => 
                                listing['Kunden-nummer'] ===  customers[key]['Kunden-nummer']);
                        });
                        res.json({ 
                            data: { ...customers },
                            message: 'Erfolg' 
                        });
                    })
                    .catch((err) => {
                        res.json({ message: '' + err});
                        next();
                    });
            }
        }) ;
    } else {
        return res.json({message: 'incorrect file type'});
    }
};
