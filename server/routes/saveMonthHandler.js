const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');


exports.saveMonthHandler = (req, res) => {
  if (!req.body) return console.error('no client body');
  const listofIds = Object.values(req.body).reduce((p,c) => {
      const idArr = c.listings.map(listing => listing._id);
      p.push(...idArr);
      return  p;
  }, []);
    const promises = listofIds.map(id => {
      return new Promise((resolve, reject) => {
        ReceiptDB.findByIdAndUpdate( id, { locked: true}, (err, model) =>{
         console.log(model, err);
          if (err) return reject(err);

          resolve();
        });
      });
    });
    Promise.all(promises)
      .then(() => res.json({ message: 'success' }))
      .catch((err) => {
          res.json({ message: '' + err});
      });
};

