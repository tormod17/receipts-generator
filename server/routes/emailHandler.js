const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');

const nodemailer = require('nodemailer');

const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');
const path = require('path');

const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailAddress,
    pass: emailPassword
  }
});


exports.emailHandler = (req, res) => {
  //const { selectedIds } = req.body;
  const  { clients } = req.body;    
  if (!clients) return res.json({ message: 'no clients' });
  const promises = Object.values(clients).map(client=> {
    return new Promise ((resolve, reject) => {       

      const mailOptions = {
         from: emailAddress,
         to: client['Emailadresse'],
         subject: 'Sending Email using Node.js' + client['Emailadresse'],
         text: 'That was easy!'
      };
      transporter.sendMail(mailOptions)
      .then((result) => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    });
  });

  Promise.all(promises)
    .then((output) => { 
      console.log(output);
      res.json({ 
        message: 'email sent' 
      });
    })
    .catch((err)=>{
      res.json({ message: '' + err});
  });

};


