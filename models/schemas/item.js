const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var itemSchema = new Schema({
        url: {type: String, required: true},
        identifier: {type: String, required: true},
        fields: [{
            key: String,
            value: String,
            _id: false
        }],
        channel: {
            url: String,
            key: String
        }
    },
    {
        toObject: {getters: true},
        timestamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
    }
);

itemSchema.index({url: 1, identifier: 1});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
