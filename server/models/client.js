const mongoose = require('mongoose');
const Receipts = require('./receipts.js');

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
