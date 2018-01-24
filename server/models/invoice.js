const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    _id: {
        type: Object
    },
    Belegart: {
        type: String
    },
    clientId: {
        type: String
    },
    'Rechnungs-nummer': {
        type: Number
    },
    'Rechnungs-datum': {
        type: String
    },
    transactions: {
        type: Array //Receipts
    },
    feeds: [mongoose.Schema.Types.Mixed]
}, { strict: false });

var Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;