const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');


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
        
        const bills = jsonResults.map(record => {
            const Rechnungsnummer = uuidv1();
            return {
                ...record,
                filename,
                userId,
                created: DATETIMESTAMP,
                clientId: record['Kunden-nummer'],
                _id: Rechnungsnummer
            };
        });
    
        const customers = bills.reduce( (p, c) => {
            const listings = bills.filter(bill => 
                bill['Kunden-nummer'] ===  c['Kunden-nummer']);
            p[ c['Kunden-nummer']] = {
                Emailadresse: c['Emailadresse'],
                Kunde: c['Kunde'],
                Stadt: c['Stadt'],
                Straße: c['Straße'],
                PLZ: c['PLZ'],
                'Kunden-nummer': c['Kunden-nummer'],
                _id: c['Kunden-nummer'],
                listings: [ ...listings],
                created: DATETIMESTAMP,
                Belegart: (c['Auszahlung'] && 'Auszahlung' || c['Rechnung'] && 'Rechnung'),
                Rechnungsnummer: c['Rechnungsnummer'] || 0,
                'Rechnungs-datum': DATETIMESTAMP,
                'FR': 0
            };
            return p;
        }, {}); 
        
        ReceiptDB.insertMany(bills, err => {
            if(err) { 
                return res.json( { message: err });
            } else {
                const promises = Object.values(customers).map(client => {
                    return new Promise((resolve, reject)=> {
                        ClientDB.findById(client._id,(err, oldclient) => {
                            if (oldclient){
                                oldclient['Emailadresse']=  client['Emailadresse'],
                                oldclient['Kunde']=  client['Kunde'],
                                oldclient['Stadt']=  client['Stadt'],
                                oldclient['Straße']=  client['Straße'],
                                oldclient['PLZ']=  client['PLZ'],
                                oldclient['Kunden-nummer']= client['Kunden-nummer'],
                                oldclient['_id']=  client['Kunden-nummer'],
                                client['listings'].forEach(list => {
                                    oldclient['listings'].push(list);
                                });
                                oldclient['Belegart'] = client['Belegart'],
                                oldclient['FR'] = client['FR'],
                                oldclient.save((err)=>{
                                    if (err) {
                                      console.log('I GET TO HERE first', err);
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
                    .then(() => res.json({ message: 'success' }))
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
