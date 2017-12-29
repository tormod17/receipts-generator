const ReceiptDB = require('../models/receipts');
const ClientDB = require('../models/client');
const { calculateTotals } = require('../helpers/helpers');
const pug = require('pug');

const nodemailer = require('nodemailer');
const DATETIMESTAMP = Date.now();
const uuidv1 = require('uuid/v1');
const path = require('path');

const app =require('express');

const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailAddress,
    pass: emailPassword
  }
});

console.log(path.resolve('views', 'transactions', 'html.png'));

exports.emailHandler = (req, res) => {
  //const { selectedIds } = req.body;
  const  { clients } = req.body;    
  if (!clients) return res.json({ message: 'no clients' });
  const promises = Object.values(clients).map(client=> {
    return new Promise ((resolve, reject) => {       
      const htmlTemplate = pug.compileFile(path.resolve(path.resolve('views', 'transactions', 'html.png')));
      
      const guests = client.listings.filter(listing => listing['Name des Gastes']);
      const corrections = client.listings.filter(listing => !listing['Name des Gastes']);

      const totalFields = [ 
        {
          name: 'Gesamtauszahlungsbetrag',
          value: calculateTotals('Auszahlung', guests, corrections) + '€'
        },
        {
          name: 'Gesamtrechnungsbetrag',
          value: calculateTotals('Rechnungs', guests, corrections) + '€'
        },
        {
          name: 'Darin enthaltene Ust. (19%)',
          value: calculateTotals('Rechnungs', guests, corrections, 'tax') + '€'
        }
      ]; 
      const emailDetails = { 
        title: 'Airgreets Gmbh',
        email: 'hello@Airgreets.com',
        info: 'München, den   31.10.2017',
        userText: 'Bitte überweise obigen Betrag bis zum 15.11.17 auf das untenstehende Konto',
        salu: 'Beste Grüße',
        userName: 'Florian'
      };

      const html = htmlTemplate({ 
          name: client['Kunde'],
          customerNumber: client['Kunden-nummer'],
          Rechnungsnummer: client['Rechnungsnummer'],
          Rechnungsdatum: client['Rechnungs-datum'],
          headings: ['Name des Gastes',  'Anreisedatum', 'Abreisedatum', 'Leistungsbeschreinung', '', 'Betrag'],
          listings: [...client.listings],
          guests: [...guests],
          corrections: [...corrections],
          totals: [...totalFields],
          emailDetails: { ...emailDetails}
        });

      const subjectTemplate = pug.compileFile('./views/transactions/subject.pug');
      const subject = subjectTemplate({ name: client['Kunde']});

      const mailOptions = {
        from: emailAddress,
        to: emailAddress, //client['Emailadresse'], // emailAddress
        subject,
        html
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


