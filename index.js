/******************** INCLUDES **********************/
var config = require('./config');
var alexa = require('alexa-app');

var KB = require('./lib/kegbot');
var helper = require('./lib/helper');

// Pull in time package
var javascript_time_ago = require('javascript-time-ago')
javascript_time_ago.locale(require('javascript-time-ago/locales/en'))
const time_ago_english = new javascript_time_ago('en-US')

// Reloaded by hotswap when code has changed (by alexa-app-server)
module.change_code = 1;

var appName = config.applicationName;

/******************* ASK MAIN ROUTINES **************/
// Define an alexa-app
var app = new alexa.app(appName);
app.launch(function(request,response) {
    // Store the Launch Intent in session, which later keeps the session going for multiple requests/commands
    response.session ('launched', 'true');

    response.say(config.greeting);

    response.shouldEndSession(false, "How can I help?");
});

app.sessionEnded(function(request,response) {
    response.say('Bye');
});

app.messages.NO_INTENT_FOUND = "I am uncertain what you mean.  Kindly rephrase...";

// Pre-execution security checks - ensure each requests applicationId match configured values
app.pre = function(request,response,type) {
    // Extract values from various levels of the nested request object
    var address = request.data.remoteAddress;
    var password = request.data.password;
    var timestamp = request.data.request.timestamp;
    var requestId = request.data.request.requestId;
    var sessionId = request.sessionId;
    var applicationId = request.sessionDetails.application.applicationId;

    // Log the request
    console.log(address + ' - ' + timestamp + ' - ' + ' AWS ASK ' + type + ' received: ' + requestId + ' / ' + sessionId);

    if (applicationId !== config.applicationId) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid application ID in request:' + applicationId);
        response.fail("Invalid application ID");
    }
};

/*************** Define ALEXA ASK Intents *****************************/
app.intent('onTap', {
    "slots":{"TapNumber":"AMAZON.NUMBER"},
    "utterances":config.utterances.onTap},
    function(request,response) {
        console.log('REQUEST: onTap Intent');
        var TapNumber = request.slot('TapNumber');
        KB.getCurrentKeg(function (err, kegs) {
            if (err) {
                replyWith(appName + ' is unable to connect to your keg bot server', response);
            } else if (TapNumber && (TapNumber > kegs.length || TapNumber < 1)) {
                replyWith(appName + ' only has ' + kegs.length + ' taps', response);
            } else if (TapNumber && TapNumber <= kegs.length) {
                var keg = kegs[(TapNumber - 1)];
                if (keg == undefined) {
                    replyWith(appName + ' has nothing on tap number ' + TapNumber, response);
                } else {
                    replyWith(appName + ' has ' + keg.type.name + ' on tap number ' + TapNumber, response);
                }
            } else if (kegs) {
                speechOutput = appName;
                kegs.forEach(function (keg, index) {
                    if (keg == undefined) { return; }
		    if (kegs.length > 1 && index === kegs.length - 1) {
                        speechOutput += ' and ';
                    }
                    speechOutput += ' has ' + keg.type.name + ' on tap';
                    if (kegs.length > 1 ) {
                        speechOutput += ' number ' + (index + 1);
                    }
                });
                replyWith(speechOutput, response);
            } else {
                replyWith(appName + ' has no beer on tap', response);
            }
        });
        return false;
    });

app.intent('Volume', {
    "slots":{"TapNumber":"AMAZON.NUMBER", "VolumeUnits":"UNITS_TYPE"},
    "utterances":config.utterances.volume},
    function(request,response) {
        console.log('REQUEST: volume Intent');
        var TapNumber = request.slot('TapNumber');
        var Units = request.slot('VolumeUnits');
        if (Units == undefined && config.units == 'imperial') {
            Units = "pints";
        }
        KB.getCurrentKeg(function (err, kegs) {
            if (err) {
                replyWith(appName + ' is unable to connect to your keg bot server', response);
            } else if (TapNumber && (TapNumber > kegs.length || TapNumber < 1)) {
                replyWith(appName + ' only has ' + kegs.length + ' taps', response);
            } else if (TapNumber && TapNumber <= kegs.length) {
                var keg = kegs[(TapNumber - 1)];
                if (keg == undefined) {
                    replyWith(appName + ' has nothing on tap number ' + TapNumber, response);
                } else {
                    if (Units == undefined || Units === "litres" || Units === "liters") {
                        replyWith(appName + ' has ' + (keg.volume_ml_remain / 1000).toPrecision(2) + ' litres of ' + keg.type.name + ' on tap number ' + TapNumber, response);
                    } else if (Units === 'pints') {
                        replyWith(appName + ' has ' + (keg.volume_ml_remain / 473.176).toPrecision(2) + ' pints of ' + keg.type.name + ' on tap number ' + TapNumber, response);
                    } else if (Units === 'percent' || Units === 'percentage') {
                        replyWith(appName + ' has ' + keg.percent_full.toPrecision(2) + ' percent of ' + keg.type.name + ' on tap number ' + TapNumber, response);
                    }
                }
            } else if (kegs) {
                speechOutput = appName;
                kegs.forEach(function (keg, index) {
                    if (keg == undefined) { return; }
		    if (kegs.length > 1 && index === kegs.length - 1) {
                        speechOutput += ' and ';
                    }
                    if (Units == undefined || Units === "litres" || Units === "liters") {
                        speechOutput += ' has ' + (keg.volume_ml_remain / 1000).toPrecision(2) + ' litres of ' + keg.type.name;
                    } else if (Units === 'pints') {
                        speechOutput += ' has ' + (keg.volume_ml_remain / 473.176).toPrecision(2) + ' pints of ' + keg.type.name;
                    } else if (Units === 'percent' || Units === 'percentage') {
                        if (keg.percent_full == 100) {
                            speechOutput += ' has a full keg of ' + keg.type.name;
                        } else {
                            speechOutput += ' has ' + keg.percent_full.toPrecision(2) + ' percent of ' + keg.type.name;
                        }
                    }
                    if (kegs.length > 1 ) {
                        speechOutput += ' on tap number ' + (index + 1) + '. ';
                    } else {
                        speechOutput += ' on tap.';
                    }
                });
                replyWith(speechOutput, response);
            } else {
                replyWith(appName + ' has no beer on tap', response);
            }
        });
        return false;
    });

app.intent('RecentSession', {
    "slots":{},
    "utterances":config.utterances.recentSession},
    function(request,response) {
        console.log('REQUEST: recentSession Intent');
        KB.getCurrentDrinks(function (err, drinks) {
            if (err) {
                replyWith(appName + ' is unable to connect to your keg bot server', response);
            } else if (drinks) {
                session_id=-1;
                keg={};
                drinks.forEach(function (drink, index) {
                    if (drink == undefined) { return; }
                    if (session_id == -1) {
                        session_id=drink.session_id;
                    }
                    if (session_id != drink.session_id) {
                        return;
                    }
                    if ( ! keg[drink.keg.id] ) {
                        keg[drink.keg.id] = {};
                        keg[drink.keg.id].user_ids = [];
                        keg[drink.keg.id].volume = 0;
                    }
                    keg[drink.keg.id].name = drink.keg.beverage.name;
                    keg[drink.keg.id].user_ids[drink.user_id] += 1;
                    keg[drink.keg.id].volume += drink.volume_ml;
                    keg[drink.keg.id].start = drink.session.start_time;
                });

                for (var key in keg) {
                    speechOutput = appName + ' poured ' + helper.volume(keg[key].volume);
                    speechOutput += ' of ' + keg[key].name + ' for user';
                    var plural = 0;
                    if ( Object.keys(keg[key].user_ids).length > 1 ){
                        speechOutput += 's';
                        plural = Object.keys(keg[key].user_ids).length - 1;
                    }
                    Object.keys(keg[key].user_ids).forEach( function (user, index) {
                        if (plural >= 1 && plural == index) {
                            speechOutput += ' and';
                        }
                        speechOutput += ' ' + user;
                    });
                    // Convert the date format to epoch then realtive
                    var parts = keg[key].start.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
                    var date = Date.UTC(+parts[1], parts[2]-1, +parts[3], +parts[4], +parts[5]);
                    speechOutput += ' ' + time_ago_english.format(date) + '. ';
                }

                replyWith(speechOutput, response);
            } else {
                replyWith(appName + ' has not had any sessions', response);
            }
        });
        return false;
    });

app.intent('HelpIntent',
    {"utterances":config.utterances.Help
    },function(request,response) {
        console.log('REQUEST:  Help...');
        response.say(config.help.say.toString()).reprompt('What would you like to do?').shouldEndSession(false);
        response.card(appName, config.help.card.toString());
    });

// Custom ASK response handler
function replyWith(speechOutput,response) {
    // Log the response to console
    console.log('RESPONSE: ' + speechOutput);

    // 'Say' the response on the ECHO
    response.say(speechOutput);

    // Show a 'Card' in the Alexa App
    response.card(appName,speechOutput);

    // If this is a Launch request, do not end session and handle multiple commands
    if (response.session ('launched') === 'true') {
        response.shouldEndSession (false);
    }

    // 'Send' the response to end upstream asynchronous requests
    response.send();
}

module.exports = app;
