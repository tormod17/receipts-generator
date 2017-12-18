const ReceiptDB = require('../models/receipts');
const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');


exports.addReceiptsHandler =(req, res) => {
  if (!req.query.userId) return console.error('no userId');
  const { userId } = req.query;
  
  console.log('ADDING A USER MANUALLY NOT BY UPLOAD');
  const { guests, corrections, customer, type }= req.body;   
  const billType =  type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X'};
      
  if (Object.keys(guests|| {}).length >0){
      Object.keys(guests).forEach(key => {
          const Rechnungsnummer = uuidv1();
          const new_receipt = {
              ...customer,
              ...guests[key],
              ...billType,
              filename: 'manual entry',
              Rechnungsnummer: !guests[key]['Rechnungsnummer'] && Rechnungsnummer,
              'Rechnungs-datum':  customer['Rechnungs-datum']|| DATETIMESTAMP,
              userId,
              time: DATETIMESTAMP,
              _id: Rechnungsnummer
          };
          ReceiptDB.create(new_receipt, function(err) {
              if (err) return console.error(err);
              res.json({ message:'Your receipt has been added for guests'});
          });
      });

  }

  if (Object.keys(corrections || {}).length > 0) {
      Object.keys(corrections).forEach(key => {
          const Rechnungsnummer = uuidv1();
          const new_receipt = {
              ...customer,
              ...corrections[key],
              ...billType,
              filename: 'manual entry',
              Rechnungsnummer: !corrections[key]['Rechnungsnummer'] || Rechnungsnummer ,
              userId,
              time: DATETIMESTAMP,
              _id: Rechnungsnummer
          };
          console.log(new_receipt);
          ReceiptDB.create(new_receipt, function(err) {
              if (err) return console.error(err);
              res.json({message:'Your receipt has been added for corrections'});
          });
      });
  }
  res.json({message:'No transaction added to database'});
};

exports.updateReceiptsHandler = (req,res) => {
  const { type, guests, customer, corrections } = req.body;
  const { receiptId } = req.query;
  if (!receiptId) return console.error('no receiptId');
  console.log(customer, '>>>>>>>');

  //const billType = type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X'};

  ReceiptDB.findByIdAndUpdate(receiptId, customer, (err, model) => {
      if(err) {
          console.error(err);
          return res.json({ message: err });
      }
      res.json({ message: 'customer has been updated', model : {...model, ...customer} });
  });
};

exports.delReceiptHandler = (req, res, next) => {
  if (!req.body) return console.error('no body to request');
  const ids = [...req.body];
  ids.forEach(id => {
      ReceiptDB.deleteOne({ _id: id }, function(err) {
          if (err) return console.error(err);
          console.log('receipt has been removed');
      });
  });
  res.json({ message: 'Your receipts has been removed'});
  next();

};


exports.getReceiptsHandler  = (req, res) => {

  if (!req.query) return console.error('no userId');
  const { userId } = req.query;
  ReceiptDB.find({ userId })
      .limit(100)
      .sort({ time: -1 })
      .exec((err, receipts) => {
          if (err) return console.error(err);
          res.json(receipts);
      });

};

