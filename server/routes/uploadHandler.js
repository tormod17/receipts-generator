const ReceiptDB = require('../models/receipts');

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
    const ext = originalname.split('.')[originalname.split('.').length - 1];
    if (ext === 'xlsx' || ext === 'csv' || ext === 'xlsm') {
        const workbook = xlsx.read(file.buffer);
        const sheet_name_list = workbook.SheetNames;
        const jsonResults = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
        console.log(jsonResults);
        jsonResults.forEach((receipt) => {
            const Rechnungsnummer = uuidv1();
            const new_receipt = {
                ...receipt,
                filename,
                userId,
                Rechnungsnummer,
                'Rechnungs-datum': DATETIMESTAMP,
                time: DATETIMESTAMP,
                _id: Rechnungsnummer
            };
            ReceiptDB.create(new_receipt, function(err) {
                if (err) return console.log(err);
                console.log('saved');
            });
        });
        res.json(jsonResults);
    }
  
};




