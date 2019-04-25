const mongoose = require('mongoose');

const MetaDataModel = new mongoose.Schema({
    any: {}
}, {
    collection: 'metadata_extractor',
    strict: false,
    timestamps: { creadAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('MetaDataModel', MetaDataModel);