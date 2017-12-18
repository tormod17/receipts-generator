const mongoose = require('mongoose');
const Listing = require('./listing.js');

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
        type: Array
    }
}, { strict: false });

var Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
