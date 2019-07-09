

const express = require('express')
const rp = require('request-promise');
const app = express();

const apiErrors = require("../ApiErrors");

const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/monitor', router);

const unqfyURL = 'http://localhost:5001/api/';
const options = {
    url: '',
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
    },
    json: true,
};
let verificacionActivada = true;
let lastStatus = "";


router.get("/status", (req,res,next) => { //endpoint para activar o desactivar el monitor
    res.status(200);
    verificacionActivada = !verificacionActivada;
    res.json("Servicio " + ((verificacionActivada) ? "Activado" : "Desactivado"))
})



const getStatus = function(){ //llamada a la api para ver si el server esta ON
    options.url = unqfyURL + '/artists/0';
    return rp.get(options);
}


const checkStatus = function(){ // Si esta activado el monitor, checkea si cambio el estado
    if (verificacionActivada){
        let status = "";
        getStatus()
        .then( resp => {
            console.log("El servidor funciona");
            status = "ON";
            notificarViaSlack(status);
        })
        .catch( error => {
            console.log("El Servidor No funciona");
            status = "OFF";
            notificarViaSlack(status);
        })
    }
}

const notificarViaSlack = function(status) { //notifico por slack
    if (status != lastStatus){
        lastStatus = status;
 
        const url = 'https://hooks.slack.com/services/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';
        var payload = {"text": new MonitorMessage(status).Notify()}
        payload = JSON.stringify(payload);

        rp.post({url: url, body: payload})
        .then(resp => {
            console.log("Enviada notificacion al slack");
        })
        .catch(error => {
            console.log(error.message);
        })      
    }   
}


app.listen(port);
console.log('Api Ready! ' + port);
setInterval(checkStatus, 5000);

class MonitorMessage{
    constructor(status){
        this.status = status;
        this.mensajeDeRestaablecimiento = "[ON]El servidor volvió a funcionar ";
        this.mensajeDeCayoServer = "[OFF]El servidor dejo de funcionar ";
    }

    Notify(){
        let msg = "";
        const dat = new Date();
        if (this.status == "ON"){
              msg = this.mensajeDeRestaablecimiento ; 
        }else{
            msg = this.mensajeDeCayoServer;
        }
        return  msg + '[ ' + dat.toDateString() + 'a las: ' + dat.getHours() + ':' + dat.getMinutes() + ':' + dat.getSeconds() + ' ]';
    }
}
