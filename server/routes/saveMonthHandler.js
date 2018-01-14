const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

exports.saveMonthHandler = (req, res) => {
  const clients  = { ...req.body };
  if (!clients) return console.error('no client body');
  console.log(clients);
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
        // array of all saved Receipts this needs to be added back to the clients and sent back to the  frontend. 
        const clientPromises = Object.values(clients).map(client => {
          return new Promise((resolve, reject) => {
            ClientDB.findByIdAndUpdate( client._id, { $inc: {Rechnungsnummer: 1 } }, {new: true}, (err, model) => {
              if (err) return reject(err);
              resolve(model);
            });
          });
        });
        
        Promise.all(clientPromises)
          .then((updatedClients)=>{
            updatedClients.map(client => {
              client.listings = updatedReceipts.filter(receipt => 
                client.listings.includes(receipt._id));
            });
            res.json({
              clients: updatedClients,
              message: 'Gerettet'
            });
          })
          .catch((err) => {
            res.json({ message: '' + err});
          });
      })
      .catch((err) => {
          res.json({ message: '' + err});
      });
};

