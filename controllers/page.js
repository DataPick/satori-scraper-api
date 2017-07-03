const mongoose = require('mongoose');
const Page = require('../models/schemas/page');

/*
 * Get a list of all existing pages
 */
exports.getPages = (req, res, next) => {

    Page.find({})
        .exec((err, pages) => {
            if (err) return next(err);
            if (!pages) return res.status(400).send('Failed to get a list of pages');

            return res.json(pages);

        });
};

/*
 * Create a new page
 * Each page corresponds to a url to be scraped. On each page are one or more 
 * 'items' that contain individual data points to be tracked,
 */
exports.createPage = (req, res, next) => {

    // TODO: Validate data.

    var pageData = {
        url: req.body.url,
        boxSelector: req.body.boxSelector,
        nameSelector: req.body.nameSelector,
        imageSelector: req.body.imageSelector,
        fields: req.body.fields,
        frequency: req.body.frequency,
    };


    // Save new page.
    var newPage = new Page(pageData);
    newPage.save((err, page) => {
        if (err) return next(err);
        if (!page) return res.status(400).send('Failed to create query');

        req.body.page = page;

        return next();
    });
};

