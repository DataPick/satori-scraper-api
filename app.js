const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const RTM = require('satori-sdk-js');

const config = require('./models/config');

const page = require('./controllers/page');
const item = require('./controllers/item');
const scraper = require('./controllers/scraper'); 
const satori = require('./controllers/satori');

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {server: {socketOptions: {keepAlive: 120}}});


// set up task schedulers
scraper.findUpdates('test');
var hourlySchedule = schedule.scheduleJob("*/1 * * *", scraper.scheduleHourly);
// var testSchedule = schedule.scheduleJob("*/1 * * * *", scraper.scheduleTest);
// var minuteSchedule = schedule.scheduleJob("*/1 * * * *", scraper.scheduleTest);
//var hourlySchedule = schedule.scheduleJob("*/1 * * *", scraper.scheduleHourly);
//var dailySchedule = schedule.scheduleJob("*/1 * *", scraper.scheduleDaily);
//var weeklySchedule = schedule.scheduleJob("*/1 *", scraper.scheduleWeekly);

var app = express();
var router = express.Router();

// log if in dev mode
if (app.get('env') !== 'production') app.use(logger('dev'));

// run init script from init directory
//require('./init/init');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//================================================
// Middleware
//================================================

// placeholder

//================================================
// Routes
//================================================

// routes
router.route('/pages')
    .post(page.createPage, item.createItemsFromPage, satori.publishNewItems)
    .get(page.getPages)

app.use('/', router);

// handle 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).send();
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send();
});

var server = app.listen(config.port, function() {
    console.log('Listening at http://localhost:%s in %s mode',
    server.address().port, app.get('env'));
});

module.exports = app;

