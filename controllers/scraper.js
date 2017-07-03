const Page = require('../models/schemas/page');
const mongoose = require('mongoose');
const scraperjs = require('scraperjs');
const item = require('./item');

/*
 * Find updates at an hourly rate.
 */
exports.scheduleHourly = () => {
    findUpdates('hourly');
};

exports.scheduleMinute = () => {
    findUpdates('minute');
};

/*
 * Find updates only once.
 */
exports.scheduleTest = () => {
    findUpdates('test');
};

/*
 * Scrape all itmes from a url and return them as an array
 */
var scrapePage = exports.scrapePage = (page, callback) => {
    scraperjs.StaticScraper.create(page.url)
        .scrape(function($) {

            // Scrape the enclosing boxes
            var boxes = $(page.boxSelector);

            var items = [];

            // Each box corresponds to an item.
            for (var i = 0; i < boxes.length; i++) {

                // Find all regular fields in a box.
                fields = page.fields.map(function(field) {
                    var element = $($(boxes[i]).find(field.selector));
                    if (field.name === "link" && element.prop('tagName') === 'A' && element.attr('href'))
                        return { key: field.name, value: element.attr('href')};
                    
                    return { key: field.name, value: $(boxes[i]).find(field.selector).contents().not($(boxes[i]).find(field.selector).children()).text().trim()};
                });

                // Finally construct the item with name, image(optional), and field.s
                items[i] = {
                    name: $(boxes[i]).find(page.nameSelector).contents().not($(boxes[i]).find(page.nameSelector).children()).text().trim(),
                    image: $(boxes[i]).find(page.imageSelector).attr('src'),
                    fields: fields
                }
            }

            return items;
        })
        .then(function(items) {
            console.log('Scraped ' + items.length + ' items from ' + page.url);
            return items;
        })
        .then(function(items) {
            callback(items);
        });
};

/*
 * Find all pages which are update for the given frequency, and check them for updates.
 */
var findUpdates = exports.findUpdates = (frequency) => {
    Page.find({frequency: frequency}, (err, pages) => {
        pages.forEach(function(page) {
            item.checkItems(page);
        });
    });
}

