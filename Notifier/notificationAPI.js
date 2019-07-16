const express = require('express')
const rp = require('request-promise');
const app = express()
const subsManager = require ("./subscriptionManager")

const apiErrors = require("./ApiErrors.js")

const bodyParser = require('body-parser')
const port = process.env.PORT || 5002;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);

const unqfyURL = 'http://172.18.0.2:5001/api';
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
    checkMissingArgument(req.body, 2);
    if(req.body.artistId === undefined || req.body.email === undefined) throw new apiErrors.InvalidJSON();
    
    checkArtistFromUNQfy(req.body.artistId).then(()=>{   
            subscriptionManager.addSubscriber(req.body.artistId, req.body.email)
            res.status(200)
            res.json({})
            }).catch(error => {console.log(error)
                next (new apiErrors.RelatedElementNotFound())})
})


//Desubscribe un email de un feed. Si el email no esta suscrito no hace nada.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.delete('/unsubscribe', (req, res, next) => {
    checkMissingArgument(req.body, 2);
    if(req.body.artistId === undefined || req.body.email === undefined) throw new apiErrors.InvalidJSON();
    
    checkArtistFromUNQfy(req.body.artistId).then(()=> {
        subscriptionManager.deleteSubscriber(req.body.artistId, req.body.email)
        res.status(200)
        res.json({})
    }).catch(error => {console.log(error)
        next (new apiErrors.RelatedElementNotFound())})
})


//Notifica vía mail, un mensaje a todos los usuarios suscritos a este artista. Se
//utilizará el subject, from y cuerpo de email pasados en el body del request.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.post('/notify', (req, res, next) => {
    checkMissingArgument(req.body, 3);
    if(req.body.artistId === undefined || req.body.subject === undefined || 
        req.body.message === undefined) throw new apiErrors.InvalidJSON();
    
    checkArtistFromUNQfy(req.body.artistId).then(()=>{        
        subscriptionManager.notifySubscribers(req.body.artistId, req.body.subject, req.body.message)
        res.status(200)
        res.json({})
    }).catch(error => {console.log(error)
        next (new apiErrors.RelatedElementNotFound())})
})


//Retorna el listado de suscriptores para el artista <artistID>.
//Este EP chequea usando la API de UNQfy que el artista exista.
router.get('/subscriptions', (req, res, next)=>{
    let artistId = Number(req.query.artistId)
    if(req.query.artistId === undefined) throw new apiErrors.InvalidJSON();
    checkArtistFromUNQfy(req.query.artistId).then(()=>{        
        let subscribers = subscriptionManager.getSubscribers(artistId);
        if (subscribers === undefined) {subscribers = []}
        res.status(200)
        res.json({
            artistId: artistId,
            subscriptors: subscribers
        })
    }).catch(error => {console.log(error)
        next (new apiErrors.RelatedElementNotFound())})
})


//Borra todas las suscripciones para un artista (útil cuando se borra un artista en UNQfy).
//Este EP chequea usando la API de UNQfy que el artista exista.
router.delete('/subscriptions', (req, res, next)=> {
    checkMissingArgument(req.body, 1);
    if(req.body.artistId === undefined) throw new apiErrors.InvalidJSON();
    checkArtistFromUNQfy(req.body.artistId).then(()=>{        
        subscriptionManager.deleteAllSubscribers(req.body.artistId)
        res.status(200)
        res.json({})
    }).catch(error => {console.log(error)
    next(new apiErrors.RelatedElementNotFound())})
})

router.get('/status', (req,res,next) => {
    res.status(200);
    res.json("OK");
})



//Chequea usando la API de UNQfy que el artista exista.
function checkArtistFromUNQfy(artistId){
    options.url = unqfyURL + '/artists/' + artistId;
    return rp.get(options).then((res) => {
        return res.id === artistId;
    }).catch(error => {console.log(error.message)
    throw new apiErrors.RelatedElementNotFound})
}

function checkMissingArgument(body, size){
    if (Object.keys(body).length != size) throw new apiErrors.MissingArgumentJSON()
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
