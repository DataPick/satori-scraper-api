const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var itemSchema = new Schema({
        url: {type: String, required: true},
        name: {type: String, required: true},
        image: {type: String},
        fields: [{
            key: String,
            value: String,
            _id: false
        }]
    },
    {
        toObject: {getters: true},
        timestamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
    }
);

itemSchema.index({url: 1, name: 1, image: 1});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
