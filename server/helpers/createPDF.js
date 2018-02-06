const pdfMake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
const { calculateTotals, calculateTaxTotals } = require('./helpers');
const { formatDate } = require('react-day-picker/moment');
//const 'moment/locale/de';

const logo = 'data:image/png;base64,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';

exports.createPDF = (client) => {
  const guests = client.transactions.filter(listing => listing['Name des Gastes']);
  const corrections = client.transactions.filter(listing => !listing['Name des Gastes']);
  const isInvoice = client['Belegart'] === 'Rechnung';

  const letter = {
    title: 'Airgreets Gmbh',
    email: 'hello@Airgreets.com',
    info: 'München, den   31.10.2017',
    address: {
      st: 'Kaufinger Straße 15',
      city: '80331 München'
    },
    customer: {
      Kunde: client['Kunde'],
      Stadt: client['Stadt'],
      Straße: client['Straße'], 
      PLZ: client['PLZ'],
      Kundennummer: 'Kundennummer  '+ client['Kundennummer']
    },
    heading: isInvoice ? 'Rechnungsübersicht' : 'Auszahlungsübersicht',
    subHeading: 'Bitte bei Zahlung und Schriftverkehr angeben',
    invoiceNumber: 'Rechnungsnummer    '+ client['Rechnungsnummer'],
    userText: isInvoice ? 'Bitte überweise obigen Betrag bis zum 15.11.17 auf das untenstehende Konto' : 
      'Der obige Betrag wird Dir die nächsten Tage auf Dein Konto überwiesen.',
    salu: 'Beste Grüße',
    userName: 'Florian',
    finfo: 'IBAN: DE22700700240017773301, SWIFT-BIC: DEUTDEDBMUC',
    finfo1: 'Geschäftsführung: Julian Ritter, Sebastian Drescher',
    finfo2: 'Florian Bogenschütz Handelsregister: Amtsgericht München, HRB-Nr. 227243',
    finfo3: 'Sitz der Gesellschaft: München Steuernr: 143/112/10719',
    docName: 'letter'
  };

  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  pdfMake.fonts = {
    'aileron-regular-webfont': {
      normal: 'aileron-regular-webfont.ttf'
    },
    'SourceSansPro': {
      normal: 'SourceSansPro-Regular.ttf',
      bold: 'SourceSansPro-SemiBold.ttf'      
    }
  };

  const titleHeaders = [
    '#',
    'Name des Gastes',
    'Anreisedatum',
    'Abreisedatum',
    'Leistungsbeschreinung',
    '',
    'Betrag'
  ];

  const headers = titleHeaders.map(title => {
    return {
      colSpan: title === 'Leistungsbeschreinung' ? 2 : 1,
      text: title,
      style: 'tableHeader'
    };
  });

  const guestFields = [
    '#',
    'Name des Gastes',
    'Anreisedatum',
    'Abreisedatum (Leistungsdatum)',
    'Airbnb Einkommen',
    'Reinigungs-gebühr',
    'Airgreets Service Fee (€)'
  ];


  function createRows(rowData, fields, numberOfRows = 0) {
    return rowData.map((guest, index) => 
      fields.map( field  => {
        if ((/datum/).test(field)) {
          return  guest[field] || '-' ;
        } else if ( field === '#') {
          return (Number(index) + 1) + numberOfRows;
        } else {
          return (/\d+/).test(guest[field]) ? guest[field].replace('€', '') + '€': guest[field];
        }
      })
    );
  }

  const guestRows = createRows(guests, guestFields);

  const newGuestRows = guestRows.map(row => {
    const rowArr = [];
    const firstRow = [ 
      {
        rowSpan: 3,
        text: row[0]
      },
      {
        rowSpan: 3,
        text: row[1]
      },
      {
        rowSpan: 3,
        text: row[2]
      },
      { 
        rowSpan: 3,
        text: row[3]                
      },
      {
        text: 'Auszahlung:',
        colSpan: 2
      },
      '',
      {
        text: row[4],
        alignment: 'right',
        border: [ false, false, true, false]
      }
    ];
    rowArr.push(firstRow);
    const secondRow =   [ 
        '',
        '',
        '',
        '',
        { text: 'davon: Reinigungs-gebühr', fillColor: '#CCCCCC', colSpan: 2},
        '',
        {
          text: row[5],
          alignment: 'right',
          border: [ false, false, true, false]
        }
    ];
    rowArr.push(secondRow);
    const thirdRow =[
       '',
       '',
       '',
       '',
      { text: 'davon: Airgreets Service Fee (25%)', colSpan: 2},
      '',
      {
        text: row[6],
        alignment: 'right',
        border: [ false, false, true, true]

      }
    ];
    rowArr.push(thirdRow);
    return  rowArr;
  });
  
  const correctionFields = [
    '#',
    'Name des Gastes',
    'Anreisedatum',
    'Abreisedatum (Leistungsdatum)',
    'Sonstige Leistungsbeschreibung',
    'Rechnungskorrektur in €',
    'Auszahlungskorrektur in €'
  ];

  const correctionRows = createRows(corrections, correctionFields, guestRows.length);
  const newCorrectionRows = correctionRows.map(row => {
    const rowArr = [];
    const firstRow = [ 
      {
        rowSpan: 3,
        text: row[0]
      },      {
        rowSpan: 3,
        text: '-' //row[0]
      },
      {
        rowSpan: 3,
        text: row[2]
      },
      { 
        rowSpan: 3,
        text: row[3]                
      },
      { 
        rowSpan: 3,
        text: row[4]                
      },
      {
        text: 'Korrektur'
      },
      {
        text: '-',
        alignment: 'right',
        border: [ false, false, true, false]
      }
    ];
    rowArr.push(firstRow);
    const secondRow =   [ 
        '',
        '',
        '',
        '',
        '', 
        'Auszahlung',
        {
          text: (row[6] || 0),
          color: (/-/).test(row[6]) && 'red',
          alignment: 'right',
          border: [ false, false, true, false]
        }
        
    ];
    rowArr.push(secondRow);
    const thirdRow =[
       '',
       '',
       '',
       '',
       '',
       'Rechnung',
      { 
        text: (row[5] || 0),
        color: (/-/).test(row[5]) && 'red',
        alignment: 'right',
        border: [ false, false, true, true]
      }
    ];
    rowArr.push(thirdRow);
    return  rowArr;
  });
  let totalFields = [ 
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
      value: calculateTaxTotals('Rechnungs', guests, corrections) + '€'
    }
  ]; 

  if (client['Belegart'] === 'Rechnung') {
    totalFields.splice(0, 1);
  } 

  const totalRows  = totalFields.map(obj =>
        [
          {
            text: '',
            colSpan: 4,
            border: [false, false, false, false]
          },
          '',
          '',
          '',
          {
            text: obj.name,
            bold: obj.name === 'Gesamtauszahlungsbetrag',
            colSpan: 2
          },
          '',
          { 
            text: obj.value,
            alignment: 'right'
          }
        ]
  );


  const dd = {
    images: {
      logo: logo
    },
    content: [{
        image: logo,
        width: 120
      },
      {
        text: letter.title + ' | ' + letter.address.st + ' | ' + letter.address.city,
        width: 100,
        style: 'detailText'
      },
      {
        columns: [
          {
            text: letter.customer.Kunde + '\n'+ letter.customer['Straße'] + '\n'+ letter.customer.PLZ + ' '+ letter.customer.Stadt + '\n'+letter.customer['Kundennummer'],
            alignment: 'left',
            style: 'address'
          },
          {
            text: letter.title + '\n '+ letter.address.st + '\n'+ letter.address.city +' \n ' +letter.email,
            alignment: 'right',
            style: 'address'
          }
        ]
      },
      {
        text: letter.heading,
        style: 'heading'
      },
      {
        text: 'München, den  ' + formatDate(new Date(Number(client['Rechnungsdatum'])),  'LL', 'de'),
        alignment: 'right'
      },
      {
        text: letter.invoiceNumber,
        style: 'invoiceNumber'
      },
      {
        text: letter.subHeading, 
        style: 'subHeading'
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: [20, 80, 80, 80, 100, 'auto', 50],
          body: [
            [...headers],
            ...[].concat(...newGuestRows),
            ...[].concat(...newCorrectionRows),
            ...totalRows
          ]
        }
      },
      {
        text: letter.userText,
        style: 'salu',
        margin: [0 , 10, 0 , 10]
      },
      {
        text: letter.salu,
        style: 'salu'
      },
      {
        text: letter.userName,
        style: 'salu',
        margin: [0 , 0, 0 , 10]
      },
      {
        text: letter.finfo,
        style: 'finfo'
      },
      {
        text: letter.finfo1,
        style: 'finfo'
      },
      {
        text: letter.finfo2,
        style: 'finfo'
      },
      {
        text: letter.finfo3,
        style: 'finfo'
      }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      detailText: {
        fontSize: 8,
        margin: [0, 20, 0, 20]        
      },
      address: {
        fontSize: 12
      },
      heading: {
        fontSize: 14,
        margin: [0, 10, 0, 10],
        bold: true,
        color: '#189da7'
      }, 
      invoiceNumber: {
        fontSize: 12,
        bold: true
      }, 
      subheading: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        fontSize: 10
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        fillColor: '#CCCCCC',
        border: 'none',
        color: 'black'
      },
      salu: {
        fontSize: 12,
        alignment: 'left'
      },
      finfo: {
        fontSize: 8
      }
    },
    defaultStyle: {
      columnGap: 20,
      font: 'SourceSansPro'
    }
  };
  return pdfMake.createPdf(dd);
}
