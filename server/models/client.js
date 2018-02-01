const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    _id: {
        type: Object
    },
    clientId: {
        type: String
    },
    Kunde: {
        type: String
    },
    'Kundennummer': {
        type: String
    },
    'Straße':{
        type: String
    },
    'Stadt': {
        type: String
    },
    'PLZ':{
        type: String
    },
    Belegart: {
        type: String
    },
    'Rechnungsdatum': {
        type: String
    },
    'Rechnungsnummer':{
        type: String
    },
    'Emailadresse': {
        type: String        
    },
    email: {
        type: String
    },
    listings: {
        type: Array //Receipts
    },
    feeds: [mongoose.Schema.Types.Mixed]
}, { strict: false });

var Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
