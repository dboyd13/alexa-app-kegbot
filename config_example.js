/* Default Alexa KB configuration file.  Copy this to 'config.js' and adapt as needed! */
var config = {};

/******************************** GENERAL CONFIGURATION *****************************************/
// Name of the application/skill, which does not need to match the skills 'Invocation Name',
// Defines both the Alexa-App-Server endpoint and the skills own name used in cards.
config.applicationName = 'Kegbot';

// AWS ASK applicationId, resembles 'amzn1.ask.skill.XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
config.applicationId = 'amzn1.ask.skill.XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';

// Greeting, when saying 'Alexa, open...'
config.greeting = "Kegbot, at your service";

// Preferred Units - Choose One
config.units = "imperial";
//config.units = "metric";

/***************************** Kegbot CONFIGURATION ********************************************/
// Name of the application/skill, which does not need to match the skills 'Invocation Name',
// This is what the application calls itself in the voice prompts. The space helps the speech.
config.KB_name = 'Keg Bot';

// KB server protocol (http/https)
config.KB_protocol = 'http';

// KB server FQDN/IP
config.KB_host = '127.0.0.1';

// KB server port
// comment out if not required
config.KB_port = '80';

// KB server api_key if required
// comment out if not required
//config.KB_apikey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// KB server URL construction
if ( config.KB_port ) {
    config.KB_server = config.KB_protocol + '://' + config.KB_host + ':' + config.KB_port;
} else {
    config.KB_server = config.KB_protocol + '://' + config.KB_host;
}

/******************* ASK Utterances ************************/
// Configure ASK Intent utterances using Alexa-App - reference:
//  https://www.npmjs.com/package/alexa-app#schema-and-utterances for syntax
config.utterances = {
    'onTap': [
        "what { |beer} is on { |tap}",
        "what { |beer} is pouring",
        "what { |beer} is pouring on { |tap} number {TapNumber}"
    ],
    'volume': [
        "how much {beer|} is {left|there}",
        "how much {beer|} is {left|there} in {pints|litres|percent|VolumeUnits}",
        "how much {beer|} is {left|there} in {keg|tap} { |number} {TapNumber}",
        "how much {beer|} is {left|there} in {keg|tap} { |number} {TapNumber} {reported|} in {VolumeUnits}",
        "how many {VolumeUnits} are left { |in the keg}",
        "how many {VolumeUnits} are left { |in the keg} in {keg|tap} { |number} {TapNumber}",
        "what {VolumeUnits} is left { |in the keg}",
        "what {VolumeUnits} is the keg at",
        "what is the {keg|beer} {VolumeUnits}",
        "what {VolumeUnits} is left in {keg|tap} { |number} {TapNumber}",
        "what is the {keg|beer} {VolumeUnits} in {keg|tap} { |number} {TapNumber}",
    ],
    'recentSession': [
        "tell me about the last session",
        "whats been happening",
        "whats happening",
        "whats been pouring",
        "when was the last session",
        "who has been drinking",
        "who has been drinking recently"
    ],
    'Help': [
        "{to |} help {me |}",
        "for help"
    ]
};

// Help response & card
config.help = {
    'say':  [
            'You can ask how much beer is left or what\s on tap. ' +
            'I have sent a cheat sheet of commands to your Alexa App for further reference.'
            ],
    'card': [
            'Cheat sheet: How much beer is left? / What\'s on tap?'
            ]
};

// Exports
module.exports = config;
