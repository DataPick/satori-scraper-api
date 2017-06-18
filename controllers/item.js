const mongoose = require('mongoose');
const Query = require('../models/schemas/query');
const Item = require('../models/schemas/item');
const scraper = require('./scraper');
const satori = require('./satori');

/*
 * Rescrape a webpage. Check all items to see if any have updated. If update, tell satori
 */
exports.checkItems = (query) => {

    var items = scraper.scrapeOne(query.url, query.fields);
};


/*
 * Create items from query
 */
exports.createItemsFromQuery = (req, res, next) => {
    
    var query = req.body.query;

    var items = scraper.scrapeOne(query.url, query.fields, function(items) {

        var newItems = items.map(function (cur) {
            var item = {};
                item.identifier = "",
                item.fields = cur.map(function (val, index) {
                    // set selector field in document as well
                    if (query.fields[index].identifier) item.identifier = val;

                    return { key: query.fields[index].name, value: val };
                });
                item.url = query.url;
                item.channel = query.channel;

                return item;
        });
             

        Item.create(newItems, (err, items) => {
            if (err) return next(err);
            if (!items) return res.status(400).send('Failed to create items from query.');
            
            req.body.items = items;

            return next();
        });
    });
};

