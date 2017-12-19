const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');


const xlsx = require('xlsx');
const uuidv1 = require('uuid/v1');
const DATETIMESTAMP = Date.now();

exports.uploadHandler = (req, res) => {
    const { file, query } = req;
    const { userId } = query;
    if (!file) {
      res.json({ error_code: 1, err_desc: 'No file passed' });
      return;
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
            let error = false;
            if(err) { 
                return res.json( { message: err });
            } else {
                Object.values(customers).forEach((client) => {
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
                                  error = err;
                                  console.error(err);  
                                  return res.json({ message: error });
                                } 
                            });
                        } else {
                            ClientDB.create( client, (err) => {
                              if (err) {
                                error = err;
                                console.error(err);  
                                return res.json({ message: error });
                              } 
                            });
                        }
                    });
                });
            }
            if (!error) {
                return res.json({ message: 'success' });
            }
        });
    }
};
