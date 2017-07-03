module.exports = {
    port: 3000,
    dbUrl: 'localhost:5000',
    
    // secret for creating tokens
    secret: 'ThisIsDefinitelyNotTheSecret',
    
    // satori configs
    endpoint: "wss://open-data.api.satori.com",
    appkey: "79e43f3774eeDC7ad31bA504A0230dFa",
    role: "collectibles-pricing",
    roleSecretKey: "6d618D7AAd7F6c4ccA60ffEc9E9A534D",
    channel: "collectibles-pricing"

};
