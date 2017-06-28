const mongoose = require('mongoose');
const Query = require('../models/schemas/query');
const Item = require('../models/schemas/item');
const scraper = require('./scraper');
const satori = require('./satori');

/*
 * Rescrape a webpage. Check all items to see if any have updated. If update, tell satori
 */
exports.checkItems = (page) => {

    console.log('Checking items from ' + page.url);

    var items = scraper.scrapePage(page, function(newItems) {
        newItems.forEach(function (newItem) {

            var query = {
                url: page.url,
                name: newItem.name
            };

            Item.find(query, (err, oldItems) => {
                if (err) console.log(err);

                // Check that item existed in database. If not, create a new record for it
                else if (!oldItems || oldItems.length === 0) {

                    // Create item
                    var item = newItem;
                    item.url = page.url;

                    Item.create(item, (err, createdItem) => {
                        if (err || !createdItem) console.log('Error creating item');
                        else {

                            console.log('Successfully created item \'' + createdItem.name + '\' ');

                            // Publish new item to satori
                            satori.publishNewItem(createdItem);
                        }
                    });
                } else {

                    // Select the item with the correct image
                    // Accounts for items with identical names
                    // Because images are almost always unique to an item
                    var oldItem;

                    if (oldItems.length === 1) oldItem = oldItems[0];
                    else {
                        oldItems.forEach(function(item) {
                            if (item.image == newItem.image) oldItem = item;
                        });
                    }

                    // check for updates
                    var updates = [];
                    newItem.fields.forEach(function (field, index) {
                        if (field.value != oldItem.fields[index].value) {
                            updates.push({key: field.key, newValue: field.value, oldValue: oldItem.fields[index].value});
                            console.log('Update to \'' + field.key + '\' in ' + oldItem.name + ': ' + oldItem.fields[index].value + ' > ' + field.value);
                        }
                    });

                    // only update db if there are updates.
                    if (updates.length) {

                        // update the item by saving it. saves the work of writing a complex update statement.
                        Item.findOneAndUpdate({url: page.url, name: newItem.name}, newItem, (err, updatedItem) => {
                            if (err || !updatedItem) console.log('Error updating item');

                            //send satori update.
                            satori.publishUpdate(updatedItem, updates);
                        });
                    }
                }
            });
        });
    });
};

/*
 * Create items from page
 */
exports.createItemsFromPage = (req, res, next) => {
    
    var page = req.body.page;

    var items = scraper.scrapePage(page, function(items) {

        var newItems = items.map(function (cur) {
            var item = cur;
            item.url = page.url;

            return item;
        });
             

        Item.create(newItems, (err, items) => {
            if (err) return next(err);
            if (!items) return res.status(400).send('Failed to create items from query.');
            
            req.body.items = items;
            
            console.log('Created ' + items.length + ' items from ' + page.url);

            return next();
        });
    });
};

