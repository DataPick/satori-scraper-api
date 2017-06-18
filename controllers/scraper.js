const Query = require('../models/schemas/query');
const mongoose = require('mongoose');
const scraperjs = require('scraperjs');
const item = require('./item');

exports.scheduleWeekly = () => {
    getQueries('weekly');
};

exports.scheduleDaily = () => {
    getQueries('daily');
};

exports.scheduleHourly = () => {
    getQueries('hourly');
};

exports.scheduleTest = () => {
    getQueries('test');
};

var scrapeOne = exports.scrapeOne = (url, fields, callback) => {
    scraperjs.StaticScraper.create(url)
        .scrape(function($) {

            // Scrape all the fields 
            var data = fields.map(function(field) {
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

            return transposedData;
        })
        .then(function(items) {
            console.log("GEGE");
            console.log(items);
            return items;
        })
        .then(function(items) {
            callback(items);
        });
};

/*var scrapeUrl = exports.scrapeUrl = (url, queries) => {
    scarperjs.StaticScraper.create(url)
        .scape(function($)
};*/

function getQueries (frequency) {
    Query.find({frequency: frequency}, (err, queries) => {
        if (err || !queries) return false;

        /*var urlHashes = {};

        for (var i = 0; i < queries.length; i++) {
            console.log(queries[i]);
    
            var hash = queries[i].url.prototype.hashCode;
            if (!urlHashes[hash]) urlHashes[hash] = { url: queries[i].url, queries:[queries[i]] };
            else urlHashes[hash].queries.push(queries[i]);

            scrape(queries[i].url, queries[i].selector);
        }*/

        for (var i = 0; i < queries.length; i++) {
            // Lets assume that there is only one query per url
            // item.checkItems(queries[i]);
        }
    });
}

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


