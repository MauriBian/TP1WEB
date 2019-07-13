const express = require('express')
const rp = require('request-promise');
const app = express()
const subsManager = require ("./subscriptionManager")

const apiErrors = require("../ApiErrors.js")

const bodyParser = require('body-parser')
const port = process.env.PORT || 5002;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);

const unqfyURL = 'http://localhost:5001/api';
const options = {
    url: '',
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
        'Authorization': ' ' 
    },
    json: true,
};

let subscriptionManager = new subsManager.SubscriptionManager();

//Subscribe un email a un artista. Si el email ya está suscrito no hace nada.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.post('/subscribe',(req,res,next) =>{
    if(req.body.artistId === undefined || req.body.email === undefined) throw new apiErrors.InvalidJSON;
    checkArtistFromUNQfy(req.body.artistId).then(()=>{
            console.log("subscribe - notifierAPI")   
            subscriptionManager.addSubscriber(req.body.artistId, req.body.email)
            
            res.status(200)
            res.json({})
            }).catch(error => {console.log(error)})
       
   
})

//Desubscribe un email de un feed. Si el email no esta suscrito no hace nada.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.delete('/unsubscribe', (req, res, next) => {
    if(req.body.artistId === undefined || req.body.email === undefined) throw new apiErrors.InvalidJSON;
    checkArtistFromUNQfy(req.body.artistId).then(()=> {               
        console.log(" unsubscribe - notifierAPI")
        subscriptionManager.deleteSubscriber(req.body.artistId, req.body.email)
        res.status(200)
        res.json({})
        
    }).catch(error => {console.log(error)})
})


//Notifica vía mail, un mensaje a todos los usuarios suscritos a este artista. Se
//utilizará el subject, from y cuerpo de email pasados en el body del request.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.post('/notify', (req, res, next) => {
    if(req.body.artistId === undefined || req.body.subject === undefined || 
        req.body.message === undefined) throw new apiErrors.MissingArgumentJSON();
    checkArtistFromUNQfy(req.body.artistId).then(()=>{        
        console.log(" notify - notifierAPI.js")
        res.status(200)
        res.json({})
        subscriptionManager.notifySubscribers(req.body.artistId, req.body.subject, req.body.message)
    }).catch(error => {console.log(error)})
})


//Retorna el listado de suscriptores para el artista <artistID>.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.get('/subscriptions', (req, res, next)=>{
    let artistId = Number(req.query.artistId)
    if(req.query.artistId === undefined) throw new apiErrors.MissingArgumentJSON();
    checkArtistFromUNQfy(req.query.artistId).then(()=>{        
        console.log(" notify - notifierAPI.js")
        res.status(200)
        res.json({
            artistId: artistId,
            subscriptors: subscriptionManager.getSubscribers(artistId)
            //subscribers... pero esta como subscriptors en el tp
        })
    }).catch(error => {console.log(error)})
    

})


//Borra todas las suscripciones para un artista (útil cuando se borra un artista en UNQfy).
//Este EP chequea usando la API de UNQfy que el artista exista.
router.delete('/subscriptions', (req, res, next)=> {
    let artistId = req.body.artistId
    if(req.query.artistId === undefined) throw new apiErrors.MissingArgumentJSON();
    checkArtistFromUNQfy(artistId).then(()=>{        
        console.log(" delete (all) subscriptions - notifierAPI.js")
        subscriptionManager.deleteAllSubscribers(artistId)
        res.status(200)
        res.json({})
    }).catch(error => {console.log(error)})
    
    
})

//Chequea usando la API de UNQfy que el artista exista.
function checkArtistFromUNQfy(artistId){
    options.url = unqfyURL + '/artists/' + artistId;
    return rp.get(options).then((res) => {
        return res.id === artistId;
    }).catch(error => {console.log(error.message)
    throw new apiErrors.RelatedElementNotFound})
}

function errorHandler(err,req,res,next){
    console.log(err)
    if (apiErrors.Errores.some(elem => err instanceof elem)){
        res.status(err.status)
        res.json({
        status : err.status,
        errorCode : err.errorCode
        })
    }
    if (err instanceof SyntaxError){
        res.status(400)
        res.json({
            status: 400,
            errorCode : "BAD_REQUEST"
        })
    }
    else{
        next()
    }
}

app.use(errorHandler); 
app.listen(port);
console.log('Api Ready! ' + port);