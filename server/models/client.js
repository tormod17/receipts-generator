const mongoose = require('mongoose');
const Listing = require('./listing.js');

const ClientSchema = new mongoose.Schema({
    clientId: {
        type: String,
        isRequired: true,
    },
    clientName: {
        type: String,
    },
    email: {
        type: String,
    },
    listings: {
        type: [Listing.schema],
    },
}, { strict: false });

// Do we need this for Clients?
ClientSchema.statics.checkExisting = function (email, password, callback) {
  Receipts.findOne({  })
  .exec((err, Receipts) => {

  })
};

var Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
