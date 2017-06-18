const mongoose = require('mongoose');
const Query = require('../models/schemas/query');

/*
 * Get a list of all existing queries
 */
exports.getQueries = (req, res, next) => {

    // Perform find query.
    Query.find({})
        .exec((err, queries) => {
            if (err) return next(err);
            if (!queries) return res.status(400).send('Failed to get a list of queries');

            return res.json(queries);

        });
};

/*
 * Create a new query
 */
exports.createQuery = (req, res, next) => {

    var queryData = {
        url: req.body.url,
        fields: req.body.fields,
        frequency: req.body.frequency,
        channel: req.body.channel,
        items: []
    };


    // Save new query.
    var newQuery = new Query(queryData);
    newQuery.save((err, query) => {
        if (err) return next(err);
        if (!query) return res.status(400).send('Failed to create query');

        req.body.query = query;

        return next();
    });
};

