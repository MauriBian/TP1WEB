const express = require('express')
const app = express()
const unqController = require('./UNQFYController')
const apiErrors = require("./ApiErrors")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
const bodyParser = require('body-parser')
const port = process.env.PORT || 5001;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);



router.post("/artists",(req,res,next) => {

    if (req.body.name && req.body.country ){
        try{
            let artist = unqController.addArtist(req.body)
            res.status(201)
            res.json({
                "id" : artist.id,
                "name" : artist.name,
                "albums" : artist.albums,
                "country" : artist.country})
            }

        catch{

            next(new ElementAlreadyExistsError())
        }
 
    }
    
    else{
        next(new InvalidJSON())
    }

})


router.get("/artists/:id",(req,res,next) => {
    try{
        res.status(200)
        res.json(unqController.getArtistById(req.params.id))
    }
    catch{
        next(new ElementNotFound())
    }})



router.put("/artists/:id",(req,res,next) => {
    if (req.body.name && req.body.country ){
        try{
            res.status(200) 
            res.json(unqController.updateArtist(parseInt(req.params.id),req.body))
          
        }
        catch{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
})

router.delete("/artists/:id",(req,res,next) => {res.status(204)
    try{
    unqController.RemoveArtist(req.params.id)
    res.send("Artista Eliminado")
    }
    catch{
        next(new ElementNotFound())
    }
})

router.get("/artists",(req,res) =>{
    if (req.query.name != undefined){
    res.status(200)
    res.json(unqController.getArtistsByName(req.query.name))
    }
    else{
        res.status(200)
        res.json(unqController.getArtistsByName(""))
    }

})


router.get("/status",(req,res) =>{
    res.status(200);
    res.json("OK");
})

router.post("/albums",(req,res,next) => {
    if (req.body.name && req.body.year && req.body.artistId !== undefined){
        
        try {
            if(unqController.containsIdArtist(req.body.artistId)){
                res.status(201)
                res.json(unqController.addAlbum(req.body))
            }
            else{
                next(new RelatedElementNotFound())
            }
        }
        catch{
            next(new ElementAlreadyExistsError())
        }
    }
    else{
        next(new InvalidJSON())
    }

})

router.get("/albums/:id",(req,res,next) => {
    try{
        res.status(200)
        res.json(unqController.getAlbumById(req.params.id))
    }
    catch{
        next(new ElementNotFound())
    }
})

router.patch("/albums/:id",(req,res,next) => {
    if (req.body.name || req.body.year ){
        try {
            res.status(200)
            res.json(unqController.UpdateAlbum(req.params.id,req.body))
        }
        catch{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
 
})

router.delete("/albums/:id",(req,res,next) => {
    try{
        res.status(204)
        unqController.RemoveAlbum(req.params.id)
        res.send("Album Eliminado")
    }
    catch{
        next(new ElementNotFound())
    }
})

router.get("/albums",(req,res) => {
    if (req.query.name != undefined){
        res.status(200)
        res.json(unqController.getAlbumsByName(req.query.name))
    }
    else{
        res.status(200)
        res.json(unqController.getAlbumsByName(""))
    }
})

router.post("/tracks",(req,res,next) => {

    if (req.body.name && req.body.duration  && req.body.genres){
        try{
            let track = unqController.addTrack(req.body)
            res.status(201)
            res.json(track)
            }

        catch{

            next(new ElementAlreadyExistsError())
        }
    }  
    else{
        next(new InvalidJSON())
    }

})
router.delete("/tracks/:id",(req,res,next) => {
    try{
        res.status(204)
        unqController.RemoveTrack(req.params.id)
        res.send("Track Eliminado")
    }
    catch{
        next(new ElementNotFound())
    }
})

router.get("/tracks/:id/lyrics",(req,res,next)=> {
    try{
        res.status(200)
        let lyrics = unqController.getLyrics(req.params.id)
        res.json(lyrics)
    }
    catch{
        next(new ElementNotFound())
    }
})




app.all("*",(req,res,next)=> {
    next(new ElementNotFound())
})

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