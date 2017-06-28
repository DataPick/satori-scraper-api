const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var pageSchema = new Schema({
        url: {type: String, required: true},
        boxSelector: {type: String, required: true},
        nameSelector: {type: String, required: true},
        imageSelector: {type: String},
        fields: [{
            name: String,
            selector: String,
            image: Boolean,
            _id: false
        }],
        frequency: String,
    },
    {
        toObject: {getters: true},
        timestamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
    }
);

pageSchema.index({url: 1, frequency: 1});

var Page = mongoose.model('Page', pageSchema);

module.exports = Page;
