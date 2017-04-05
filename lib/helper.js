var config = require('../config');

function volume( ml ) {
    if ( config.units == "imperial" ) {
        return (ml / 473.176).toPrecision(2) + ' pints';
    } else if ( ml >= 1000 ) {
        return (ml / 1000).toPrecision(2) + ' litres';
    } else {
        return ml + ' millilitres';
    }
}

module.exports.volume = volume;
