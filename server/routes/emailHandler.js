const { calculateTotals } = require('../helpers/helpers');
const pug = require('pug');

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const path = require('path');

const { formatDate } = require('react-day-picker/moment');

const { createPDF } = require('../helpers/createPDF')

const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;

const mgAPIKey = process.env.MAILGUN_API_KEY;
const mgDomain = process.env.MAILGUN_DOMAIN;

const auth = {
  auth: {
    api_key: mgAPIKey,
    domain: mgDomain
  }
}

const transporter = nodemailer.createTransport(mg(auth));

function createEmailFilePath(filename) {
  const newpath = process.env.NODE_ENV === 'production' ? 
    path.resolve('emails', 'transactions', filename) : path.resolve('..','emails', 'transactions', filename);
  return newpath;
}

exports.emailHandler = (req, res) => {
  const  { clients } = req.body;    
  if (!clients) return res.json({ message: 'no clients' });
  const promises = Object.values(clients).map(client=> {
    return new Promise ((resolve, reject) => {       
      const htmlTemplate = pug.compileFile(createEmailFilePath('html.pug'));

      client.transactions = client.transactions.map(trans => {     
        for (let key in trans){
          if (key.includes('datum')){
            trans[key] = `${formatDate(new Date(Number(trans[key])), 'LL', 'de')}`
            console.log(trans[key]);
          }
          trans[key] = trans[key] + ''
          trans[key].replace('€','')
        } 
        return trans; 
      })

      const guests = client.transactions.filter(listing => listing['Name des Gastes']);
      const corrections = client.transactions.filter(listing => !listing['Name des Gastes']);

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
          customerNumber: client['Kundennummer'],
          Rechnungsnummer: client['Rechnungsnummer'],
          Rechnungsdatum: `${formatDate(new Date(Number(client['Rechnungsdatum'])), 'LL', 'de')}`,
          headings: ['Name des Gastes',  'Anreisedatum', 'Abreisedatum', 'Leistungsbeschreinung', '', 'Betrag'],
          transactions: [...client.transactions],
          guests: [...guests],
          corrections: [...corrections],
          totals: [...totalFields],
          emailDetails: { ...emailDetails}
        });

   
      const subjectTemplate = pug.compileFile(createEmailFilePath('subject.pug'));
      const subject = subjectTemplate({ name: client['Kunde']});

      const pdf = createPDF(client).getBuffer((buffer) => {
        const mailOptions = {
          from: emailAddress,
          to: emailAddress, //client['Emailadresse'], // emailAddress
          attachments: [{
              filename: `inv${client['Rechnungsnummer']}.pdf`,
              content: new Buffer(buffer)
          }], 
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
      })

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


