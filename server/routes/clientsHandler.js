const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');


exports.saveMonth = (req, res) => {
  if (!req.query.month) return console.error('no month');
  const { month } = req.query;
  console.log(month , req,body);
  // Alternatively each listing within in a month can be updated with a field that locks the bill. 
  // A note of the locked months is also stored, to prevent additons . 

};


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
  if (!req.body) return console.error('no body to request');
  const ids = [...req.body];
  const promises = ids.map( id => {
    return new Promise((resolve, reject) => {
        ClientDB.deleteOne({ _id: id }, (err) => {
        if (err) reject(err);
      }).then(() => {
        ReceiptDB.remove({clientId: id}, (err) => {
          if (err) reject(err);
          resolve();          
        });
      });
    });
  });
  Promise.all(promises)
    .then(res.json({ message: 'Your clients have been removed' }))
    .catch((err)=>{
      res.json({ message: '' + err});
  });
};


exports.getClientsHandler = (req, res) => {
  /// needs to accept time parameters
  if (!req.query) return console.error('no userId');
  const { month } = req.query;
  const currentYear = new Date().getFullYear();

  const fromDate =  new Date(currentYear, (Number(month)), 15).getTime();
  const toDate = new Date(2017, Number(month + 1), 15).getTime();  

  let query = {
    created: {
     '$gte': fromDate,
     '$lt': toDate
    }
  };
  
  new Promise((resolve, reject) => {
    ClientDB.find( query )
      .limit(50)
      .sort({ created: -1 })
      .exec((err) => {
        if (err) return reject(err);
      }).then((clients) =>{
         ReceiptDB.find(query)
          .exec((err, receipts) => {
            if (err) return reject(err);
            const output = clients.map(client => {
              const newListings = client.listings.map(listing => {
                const receiptIndex = receipts.map(receipt => receipt._id).indexOf(listing);
                return receipts[receiptIndex];
              });
              client.listings = [...newListings];
              return client;
            });
            res.json(output);
          });
      }).catch(err =>{
        res.json({message: err});
      });
  });


};
