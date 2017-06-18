const RTMClient = require('satori-rtm-sdk');

exports.publishUpdates = (req, res, next) => {
    var rtm = new RTMClient(req.body.query.channel.url, req.body.query.channel.key);

    // create a new subscription with "data-channel" name
    //var channel = rtm.subscribe("data-channel", RTM.SubscriptionMode.SIMPLE);

    // client enters 'connected' state
    rtm.on("enter-connected", function() {
        req.body.items.forEach(function(item) {

            var data = item.fields;
            data._url = req.body.query.url;

            rtm.publish("DataPick", data);

            console.log('yo');

        });

        return res.sendStatus(200);
    });

    rtm.start()
};
