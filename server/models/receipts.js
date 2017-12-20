const mongoose = require('mongoose');
const Client = require('./client.js');

const ReceiptsSchema = new mongoose.Schema({
    _id: {
      type: Object
    },
    userId: {
        type: String,
        isRequired: true
    },
    email: {
        type: String
    },
    locked: {
        type: Boolean
    },
    feeds: [mongoose.Schema.Types.Mixed],
    client: {
        type: Client.schema
    }
}, { strict: false });


var Receipts = mongoose.model('Receipts', ReceiptsSchema);

module.exports = Receipts;
