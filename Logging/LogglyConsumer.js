var winston = require('winston');
var {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token: "65a791e6-133d-4735-b2f5-566412c9e535",
    subdomain: "mauriciobian",
    tags: ["Winston-NodeJS"],
    json: true
}));

function NotificarInfo(logg) {
    winston.log('info', logg);
}

function NotificarError(logg){
    winston.error(logg)
}

function NotificarWarning(logg){
    winston.warn(logg)
}
module.exports ={
    NotificarInfo,
    NotificarError,
    NotificarWarning
}