const Page = require('../models/schemas/page');
const mongoose = require('mongoose');
const scraperjs = require('scraperjs');
const item = require('./item');

exports.scheduleWeekly = () => {
    //getQueries('weekly');
};

exports.scheduleDaily = () => {
    //getQueries('daily');
};

exports.scheduleHourly = () => {
    //getQueries('hourly');
};

exports.scheduleTest = () => {
    findUpdates('test');
};

var scrapePage = exports.scrapePage = (page, callback) => {
    scraperjs.StaticScraper.create(page.url)
        .scrape(function($) {

            // Scrape the enclosing boxes
            var boxes = $(page.boxSelector);
            //console.log($(boxes[0]).find(page.nameSelector).text());
            //console.log($(boxes[1]).find(page.nameSelector).text());

            var items = [];

            for (var i = 0; i < boxes.length; i++) {

                fields = page.fields.map(function(field) {
                    return { key: field.name, value: $(boxes[i]).find(field.selector).text() };
                });

                items[i] = {
                    name: $(boxes[i]).find(page.nameSelector).text(),
                    image: $(boxes[i]).find(page.imageSelector).attr('src'),
                    fields: fields
                }
            }
            

           /* var items = boxes.map(function(cur, index) {
                
                //var box = $(cur);
                var box = $(cur);
                if (index == 0) {
                    console.log($(boxes[0]).find(page.nameSelector).text());
                    console.log(box.find(page.nameSelector));
                }

                var fields = page.fields.map(function(field) {
                    return { key: field.name, value: box.find(field.selector).text() };
                });

                var item = {
                    name: $(cur).find(page.nameSelector).text(),
                    //image: $(box.find(page.imageSelector)[0]).attr('src'),
                    fields: fields
                }
                
                return item;
            });*/
            
            /*//Scrape all the name fields
            var names = $(page.nameSelector).map(function() {
                console.log($(this).text());
                return $(this).text();
            }).get();


            var images = $(page.imageSelector).map(function() {
                return $(this).attr('src');
            }).get();

            // Scrape all the fields 
            var data = page.fields.map(function(field) {
                return $(field.selector).map(function() {
                    return $(this).text();
                }).get();
            });

            
            // Transpose 2d arrays  
            var transposedData = data[0].map(function(col, i) { 
              return data.map(function(row) { 
                return row[i] 
              })
            });

            var items = transposedData.map(function(row, index) {
                var item = {
                    name: names[index],
                    image: images[index];
                    fields: []
                };

                row.forEach(function(field, index) {
                    item.fields.push({
                        key: page.fields[index].name,
                        value: field
                    });
                });

                return item;
            });*/
            //console.log(items);

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

var findUpdates = exports.findUpdates = (frequency) => {
    Page.find({frequency: frequency}, (err, pages) => {
        console.log(pages.length);
        pages.forEach(function(page) {
            item.checkItems(page);
        });
    });
}

