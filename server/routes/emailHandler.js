const { calculateTotals } = require('../helpers/helpers');
const pug = require('pug');

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const path = require('path');
const { formatDate } = require('react-day-picker/moment');
const { createPDF } = require('../helpers/createPDF');
const { getText } = require('../language/');

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
  if (!clients) return res.json({ message: getText("TRANS.NO.CLIENTS")});
  const promises = Object.values(clients).map(client=> {
    const isInvoice = client[getText('TYPE')] === getText('INV');
    return new Promise ((resolve, reject) => {       
      const htmlTemplate = pug.compileFile(createEmailFilePath('html.pug'));

      client.transactions = client.transactions.map(trans => {     
        for (let key in trans){
          if (key.includes(getText("DATE"))){
            trans[key] = `${formatDate(new Date(Number(trans[key])), 'LL', 'de')}`
          }
          trans[key] = trans[key] + ''
          trans[key].replace('€','')
        } 
        return trans; 
      })

      const guests = client.transactions.filter(listing => listing[getText('TRANS.GUEST.NAME')])
      const corrections = client.transactions.filter(listing => !listing[getText('TRANS.GUEST.NAME')]);

      const totalFields = [ 
        {
          name: getText('TOTAL.PAYOUT'),
          value: calculateTotals(getText('PAYOUT'), guests, corrections) + '€'
        },
        {
          name: getText('TOTAL.INV'),
          value: calculateTotals(getText("INVS"), guests, corrections) + '€'
        },
        {
          name: getText('TOTAL.TAX'),
          value: calculateTotals(getText("INVS"), guests, corrections, 'tax') + '€'
        }
      ]; 

      const emailDetails = { 
        title: getText('LETTER.TITLE'),
        email: getText('LETTER.EMAIL'),
        info: getText('LETTER.DATE'),
        userText: isInvoice ? getText('LETTER.TEXT') : getText('LETTER.TEXT1'),
        salu: getText('LETTER.SALU'),
        userName: getText('USERNAME')
      };

      const html = htmlTemplate({ 
          name: client[getText("TRANS.CUSTOMER")],
          customerNumber: client[getText("TRANS.CUSTOMER.NO")],
          Rechnungsnummer: client[getText("INV.NUMBER")],
          Rechnungsdatum: `${formatDate(new Date(Number(client[getText("INV.DATE")])), 'LL', 'de')}`,
          headings: [   ,  getText("TRANS.DPRT.DATE"), getText('TRANS.ARR.DATE'), getText("REASON"), '', getText("AMOUNT")],
          transactions: [...client.transactions],
          guests: [...guests],
          payout: getText("PAYOUT"),
          cleaning: getText("TRANS.LETTER.CLEANING"),
          service: getText("TRANS.SRV.FEE"),
          inv: getText("INV"),
          correction: getText("CORRECTION"),
          corrections: [...corrections],
          totals: [...totalFields],
          emailDetails: { ...emailDetails}
        });

   
      const subjectTemplate = pug.compileFile(createEmailFilePath('subject.pug'));
      const subject = subjectTemplate({ name: client['Kunde']});

      const pdf = createPDF(client).getBuffer((buffer) => {
        console.log(client.Emailadresse);
        const mailOptions = {
          from: emailAddress,
          to: client['Emailadresse'], // emailAddress
          attachments: [{
              filename: `inv${client[getText("INV.NUMBER")]}.pdf`,
              content: new Buffer(buffer)
          }], 
          subject,
          html
        };
        transporter.sendMail(mailOptions)
        .then((result) => {
          console.log(result);
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
      res.json({ 
        message: getText("EMAIL.SENT")
      });
    })
    .catch((err)=>{
      res.json({ message: '' + err});
  });

};


