

const express = require('express')
const app = express();
const MonitorMessage = require('./monitormessage');
const MonitoreableService = require('./monitoreableservice');

const apiErrors = require("../ApiErrors");

const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const router = express.Router();
const rp = require('request-promise');


//ENDPOINTS A VERIFICAR
const unqfyURL = 'http://localhost:5001/api/status';
const loggingURL = 'http://localhost:5003/logging/status';
const notificationURL = 'http://localhost:5002/api/status';

//HEADER PARA LOS ENDPOINT
const options = function(_url) {
    return {url: _url,
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
    },
    json: true,
    }
}

const notificarViaSlack = function(service) { //notifico por slack
    const url = 'https://hooks.slack.com/services/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';
    var payload = {"text": new MonitorMessage.MonitorMessage(service).Notify()}
    payload = JSON.stringify(payload);

    rp.post({url: url, body: payload})
    .then(resp => {
        console.log("Enviada notificacion al slack");
    })
    .catch(error => {
        console.log(error.message);
    })      
}

//instancio las clases para que sean monitoreables
const unqfy = new MonitoreableService.MonitoreableService("UNQfy",options(unqfyURL),notificarViaSlack);
const logging = new MonitoreableService.MonitoreableService("Logging",options(loggingURL),notificarViaSlack);
const notification = new MonitoreableService.MonitoreableService("Notification",options(notificationURL),notificarViaSlack);

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/monitor', router);
//Activa o desactiva el monitor
let verificacionActivada = true;

router.get("/status", (req,res,next) => { //endpoint para activar o desactivar el monitor
    res.status(200);
    verificacionActivada = !verificacionActivada;
    res.json("Servicio " + ((verificacionActivada) ? "Activado" : "Desactivado"))
})



const checkAllStatus = function(){ // Si esta activado el monitor, checkea si cambio el estado
    if (verificacionActivada){
        unqfy.checkStatus();
        logging.checkStatus();
        notification.checkStatus();
    }
}




app.listen(port);
console.log('Api Ready! ' + port);
setInterval(checkAllStatus, 5000);
