var config = require('../config');
var request = require('request');

// If https is used, allow default and self signed SSL certificates
var agent;
if ( config.KB_protocol === 'https' ) {
    var https = require('https');
    var agentOptions;
    agentOptions = {
        host: config.KB_host,
        path: '/',
        rejectUnauthorized: false
    };
    if ( config.KB_port ) {
        agentOptions.port = config.KB_port;
    }
    agent = new https.Agent(agentOptions);
}

function getCurrentKeg( callback ) {
    var url = config.KB_server + "/api/taps/";
    request({
        uri:url,
        method: 'GET',
        agent: agent
    }, function (err, response) {
        if (err) {
            callback(err, null);
            return false;
        }
        var obj = JSON.parse(response.body);
        var kegs = [];
        obj.objects.forEach(function (keg) {
            kegs.push(keg.current_keg);
        });
        callback(err, kegs);
    });
}

function getCurrentDrinks( callback ) {
    var url = config.KB_server + "/api/drinks/";
    request({
        uri:url,
        method: 'GET',
        agent: agent
    }, function (err, response) {
        if (err) {
            callback(err, null);
            return false;
        }
        var obj = JSON.parse(response.body);
        var drinks = [];
        var target_session = obj.objects[0].session_id;
        obj.objects.forEach(function (drink) {
            if (drink.session_id == target_session) {
                drinks.push(drink);
            }
        });
        callback(err, drinks);
    });
}

module.exports.getCurrentKeg = getCurrentKeg;
module.exports.getCurrentDrinks = getCurrentDrinks;
