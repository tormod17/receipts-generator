const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        isRequired: true
    },
    feeds: [mongoose.Schema.Types.Mixed]
}, { strict: false });

var Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
