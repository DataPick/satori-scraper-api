const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var querySchema = new Schema({
        url: {type: String, required: true},
        fields: [{
            name: String,
            selector: String,
            identifier: Boolean,
            _id: false
        }],
        frequency: String,
        channel: {
            url: String,
            key: String
        },
    },
    {
        toObject: {getters: true},
        timestamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
    }
);

querySchema.index({url: 1, frequency: 1});

var Query = mongoose.model('Query', querySchema);

module.exports = Query;
