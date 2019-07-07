

const express = require('express')
const rp = require('request-promise');
const app = express()

const apiErrors = require("../ApiErrors")

const bodyParser = require('body-parser')
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
const mensajeDeRestaablecimiento = "[GOOD]El servidor volvió a funcionar a las: ";
const mensajeDeCayoServer = "[BAD]El servidor dejo de funcionar a las: ";

router.get("/status", (req,res,next) => {
    getStatus();
    res.status(200);
    verificacionActivada = !verificacionActivada;
    res.json("Servicio " + ((verificacionActivada) ? "Activado" : "Desactivado"))
})

const notificarViaSlack = function(status) {

    if (status != lastStatus){
        lastStatus = status;
        if (status == "OK"){
            console.log(mensajeDeRestaablecimiento + new Date());
        }else{
            console.log(mensajeDeCayoServer + new Date());
        }
        //options.url = unqfyURL + '/artists/0'; // URL del slack
        //mando consulta A LA API DEL ESLAC
    }   
}

const getStatus = function(){
    options.url = unqfyURL + '/artists/0';
    return rp.get(options);
}


const checkStatus = function(){
    if (verificacionActivada){
        let status = "";
        getStatus()
        .then( resp => {
            console.log("El servidor funciona");
            status = "OK";
            notificarViaSlack(status);
        })
        .catch( error => {
            console.log("El Servidor No funciona");
            status = "NO OK";
            notificarViaSlack(status);
        })
    }
}


app.listen(port);
console.log('Api Ready! ' + port);
setInterval(checkStatus, 5000);
