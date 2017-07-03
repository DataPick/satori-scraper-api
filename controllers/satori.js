const config = require('../models/config');
const RTM = require('satori-sdk-js');

// set up satori connection
var roleSecretProvider = RTM.roleSecretAuthProvider(config.role, config.roleSecretKey);

var rtm = new RTM(config.endpoint, config.appkey, {
  authProvider: roleSecretProvider,
});

rtm.start();

/*
 * Publish list of items when a page is created.
 */
exports.publishNewItems = (req, res, next) => {

    // create a new subscription with "data-channel" name
    //var channel = rtm.subscribe("data-channel", RTM.SubscriptionMode.SIMPLE);

    req.body.items.forEach(function(item) {

        var message = {
            name: item.name,
            image: item.image
        };

        item.fields.forEach(function(field) {
            message[field.key] = field.value;
        });

        rtm.publish(config.channel, message);


    });

    return res.sendStatus(200);
};

/*
 * Publish a new item found during a page update.
 */
exports.publishNewItem = (item) => {

    var newItem = {
        name: item.name,
        image: item.image
    };

    item.fields.forEach(function(field) {
        newItem[field.key] = field.value;
    });

    rtm.publish(config.channel, newItem);
};

/*
 * Publish an update to an item to satori channel.
 */
exports.publishUpdate = (item, updates) => {

    var message = {
        name: item.name,
        updates: updates
    };

    rtm.publish(config.channel, message);
};

