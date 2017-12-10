const mongoose = require('mongoose');
const Client = require('./client.js');

const ReceiptsSchema = new mongoose.Schema({
    userId: {
        type: String,
        isRequired: true,
    },
    email: {
        type: String,
    },
    feeds: [mongoose.Schema.Types.Mixed],
    client: {
        type: Client.schema,
    },
}, { strict: false });

ReceiptsSchema.statics.checkExisting = function (email, password, callback) {
  Receipts.findOne({  })
  .exec((err, Receipts) => {

  })
};

var Receipts = mongoose.model('Receipts', ReceiptsSchema);

module.exports = Receipts;
