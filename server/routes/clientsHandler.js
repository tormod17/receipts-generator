const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');


exports.addClientHandler = (req, res) => {
  // 
  if (!req.query.userId) return console.error('no userId');
  const { userId } = req.query;

  console.log('ADDING A USER MANUALLY NOT BY UPLOAD');
  const { guests, corrections, customer, type } = req.body;
  const billType = type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X' };

  const guestsArr = Object.keys(guests || {});

  if (guestsArr.length > 0) {
    Object.keys(guests).forEach(key => {
      const Rechnungsnummer = uuidv1();
      const new_receipt = {
        ...customer,
        ...guests[key],
        ...billType,
        filename: 'manual entry',
        Rechnungsnummer: !guests[key]['Rechnungsnummer'] && Rechnungsnummer,
        'Rechnungs-datum': customer['Rechnungs-datum'] || DATETIMESTAMP,
        userId,
        created: DATETIMESTAMP,
        _id: Rechnungsnummer
      };
      ReceiptDB.create(new_receipt, function(err) {
        if (err) return console.error(err);
        //res.json({ message:'Your receipt has been added for guests'});
      });
    });
  }
  const correctionsArr = Object.keys(corrections || {});

  if (correctionsArr.length > 0) {
    correctionsArr.forEach(key => {
      const Rechnungsnummer = uuidv1();
      const new_receipt = {
        ...customer,
        ...corrections[key],
        ...billType,
        filename: 'manual entry',
        Rechnungsnummer: !corrections[key]['Rechnungsnummer'] || Rechnungsnummer,
        userId,
        time: DATETIMESTAMP,
        _id: Rechnungsnummer
      };
      ReceiptDB.create(new_receipt, function(err) {
        if (err) return console.error(err);
        //res.json({message:'Your receipt has been added for corrections'});
      });
    });
  }
  customer.listings = [...guestsArr, ...correctionsArr];
  ClientDB.create(customer, err => {
    if (err) {
      return res.json({ message: err });
    } else {
      return res.json({ message: 'Transaction Added' });
    }
  });
};

exports.updateCleintHandler = (req, res) => {
  // needs to only update the receipt details not client

  // const { type, guests, client, corrections } = req.body;
  // const { receiptId } = req.query;
  // if (!receiptId) return console.error('no receiptId');
  // //const billType = type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X'};
  // ReceiptDB.findByIdAndUpdate(receiptId, client, (err, model) => {
  //     if(err) {
  //         console.error(err);
  //         return res.json({ message: err });
  //     }
  //     res.json({ message: 'client has been updated', model : {...model, ...client} });
  // });
};

exports.delClientHandler = (req, res) => {
  // needs to delete the receipt and the number from the client,


  if (!req.body) return console.error('no body to request');
  const ids = [...req.body];
  ids.forEach(id => {
    ReceiptDB.deleteOne({ _id: id }, function(err) {
      if (err) return console.error(err);
      console.log('receipt has been removed');
    });
  });
  res.json({ message: 'Your receipts have been removed' });
};


exports.getClientsHandler = (req, res) => {
  /// needs to accept time parameters
  if (!req.query) return console.error('no userId');
  const { month } = req.query;
  const currentYear = new Date().getFullYear();

  const fromDate =  new Date(currentYear, Number(month), 15).getTime();
  const toDate = new Date(currentYear, (Number(month) + 1), 15).getTime();  

  const query = {
    created: {
     '$gte': fromDate,
     '$lt': toDate
    }
  };

  ClientDB.find( query )
    .limit(50)
    .sort({ created: -1 })
    .exec((err, clients) => {
      if (err) return console.error(err);
      const output = clients.map((client) => {
          const newListings = client.listings.filter(listing => {
            return Number(listing.created) >= fromDate && Number(listing.created) <= toDate;
          }); 
          client.listing = [...newListings];
          return client;
      });
      res.json(output);
    });
};
