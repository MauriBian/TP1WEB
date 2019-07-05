

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

const unqfyURL = '';
const options = {
    url: '',
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
        'Authorization': ' ' 
    },
    json: true,
};


router.get("/status", (req,res,next) => {
    options.url = unqfyURL + '/artists';
    rp.get(options)
    .then( resp => {
        res.status(201);
        res.json('Servicio funcionando correctamente');
    })
    .catch( error => {
        res.status(401);
        res.json('El servicio no se encuentra funcionando');
    })

})

// router.post("/artists",(req,res,next) => {

//     if (req.body.name && req.body.country ){
//         if (!unqController.containsArtist(req.body.name)){
//             let artist = unqController.addArtist(req.body)
//             res.status(201)
//             res.json({
//                 "id" : artist.id,
//                 "name" : artist.name,
//                 "albums" : artist.albums,
//                 "country" : artist.country})
//             }
//         else {
//             next(new ElementAlreadyExistsError())
//         }
//     }
//     else{
//         next(new InvalidJSON())
//     }
    


// })


// router.get("/artists/:id",(req,res,next) => {
//     if (unqController.containsIdArtist(req.params.id)){
//         res.status(200)
//         res.json(unqController.getArtistById(req.params.id))
//     }
//     else{
//         next(new ElementNotFound())
//     }})


app.listen(port);
console.log('Api Ready! ' + port);