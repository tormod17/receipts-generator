const ReceiptDB = require('../models/receipts');

exports.saveMonthHandler = (req, res) => {
  const clients  = { ...req.body };
  if (!clients) return console.error('no client body');
  const listofIds = Object.values(clients).reduce((p,c) => {
      const idArr = c.listings.map(listing => listing._id);
      p.push(...idArr);
      return  p;
  }, []);
  const promises = listofIds.map(id => {
    return new Promise((resolve, reject) => {
      ReceiptDB.findByIdAndUpdate( id, { locked: true}, {new: true}, (err, model) =>{
        if (err) return reject(err);
        resolve(model);
      });
    });
  });
  Promise.all(promises)
    .then((updatedReceipts) => {
          const updatedClients = Object.keys(clients).map(key => {
            clients[key].listings = updatedReceipts.filter(receipt =>
              listofIds.includes(receipt._id));
            clients[key]['Rechnungsnummer'] = Number(clients[key]['Rechnungsnummer']) + 1;
            return clients[key];
          });
          console.log(updatedReceipts, 'Update Receipts');
          res.json({
            clients: updatedClients,
            message: 'Gerettet'
          });
        })
        .catch((err) => {
          res.json({ message: '' + err});
        });
    };
