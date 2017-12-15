const fs = require('fs');
const ReceiptDB = require('../models/receipts');

//const querystring = require('querystring');
//const csv = require('fast-csv');
const XLSX = require('xlsx');
const multer = require('multer'); // used for writing file before saving.
const uuidv1 = require('uuid/v1');
const path =require('path');

const DATETIMESTAMP = Date.now();

const  rootDir  = path.resolve(__dirname, '..', '..');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('Learning about paths' , rootDir );
        cb(null, rootDir + '/tmp');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.split('.')[0] + '-' + DATETIMESTAMP + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ storage }).single('file');


exports.uploadHandler = (req, res) => {

  const { userId } = req.query;
  upload(req, res, function(err) {
      const { file } = req;
      if (err) {
          res.json({ error_code: 1, err_desc: err });
          return;
      }
      if (!file) {
          res.json({ error_code: 1, err_desc: 'No file passed' });
          return;
      }
      const { originalname, filename } = file;
      const ext = originalname.split('.')[originalname.split('.').length - 1];
      if (ext === 'xlsx' || ext === 'xlsm') {
          const workbook = XLSX.readFile(rootDir + '/tmp/' + filename);
          const sheet_name_list = workbook.SheetNames;
          const jsonResults = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
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
          try {
              fs.unlinkSync(req.file.path);
          } catch (e) {
              console.error('error deleteing');
          }
          res.json(jsonResults);
      }
  });
};

