const config = require('../models/config');
const RTM = require('satori-sdk-js');

// set up satori connection
var roleSecretProvider = RTM.roleSecretAuthProvider(config.role, config.roleSecretKey);

var rtm = new RTM(config.endpoint, config.appkey, {
  authProvider: roleSecretProvider,
});

rtm.start();

exports.publishNewItems = (req, res, next) => {

    // create a new subscription with "data-channel" name
    //var channel = rtm.subscribe("data-channel", RTM.SubscriptionMode.SIMPLE);

    req.body.items.forEach(function(item) {

        var message = {
            name: item.name,
            url: item.url,
            fields: item.fields
        };

        rtm.publish(config.channel, message);


    });

    return res.sendStatus(200);
};

exports.publishNewItem = (item) => {

    var newItem = {
        name: item.name,
        url: item.url,
        fields: item.fields
    };

    rtm.publish(config.channel, newItem);
};


exports.publishUpdate = (item, updates) => {

    var message = {
        name: item.name,
        url: item.url,
        fields: item.fields,
        updates: updates
    };

    rtm.publish(config.channel, message);

};
