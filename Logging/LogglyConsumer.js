var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token: "6dc902ee-c759-4329-8f65-27a016d4cc2d",
    subdomain: "mauriciobian",
    tags: ["Winston-NodeJS"],
    json: true
}));

winston.log('info', "Hello World from Node.js!");


