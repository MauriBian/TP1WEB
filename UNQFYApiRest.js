const express = require('express')
const app = express()
const unqController = require('./UNQFYController')
const apiErrors = require("./ApiErrors")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);



router.post("/artists",(req,res,next) => {

    if (req.body.name && req.body.country ){
        if (!unqController.containsArtist(req.body.name)){
            let artist = unqController.addArtist(req.body)
            res.status(201)
            res.json({
                "id" : artist.id,
                "name" : artist.name,
                "albums" : artist.albums,
                "country" : artist.country})
            }
        else {
            next(new ElementAlreadyExistsError())
        }
    }
    else{
        next(new InvalidJSON())
    }
    


})


router.get("/artists/:id",(req,res,next) => {
    if (unqController.containsIdArtist(req.params.id)){
        res.status(200)
        res.json(unqController.getArtistById(req.params.id))
    }
    else{
        next(new ElementNotFound())
    }})



router.put("/artists/:id",(req,res,next) => {
    if (req.body.name && req.body.country ){
        if (unqController.containsIdArtist(req.params.id)){
            res.status(200) 
            res.json(unqController.updateArtist(parseInt(req.params.id),req.body))
          
        }
        else{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
})

router.delete("/artists/:id",(req,res,next) => {res.status(204)
    if (unqController.containsIdArtist(req.params.id)){
    unqController.RemoveArtist(req.params.id)
    res.send("Artista Eliminado")
    }
    else{
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

router.post("/albums",(req,res,next) => {
    if (req.body.name && req.body.year && req.body.artistId !== undefined){
        
        if (!unqController.containsAlbumByName(req.body.name)){
            if(unqController.containsIdArtist(req.body.artistId)){
                res.status(201)
                res.json(unqController.addAlbum(req.body))
            }
            else{
                next(new RelatedElementNotFound())
            }
        }
        else{
            next(new ElementAlreadyExistsError())
        }
    }
    else{
        next(new InvalidJSON())
    }

})

router.get("/albums/:id",(req,res,next) => {
    if (unqController.containsidAlbum(req.params.id)){
        res.status(200)
        res.json(unqController.getAlbumById(req.params.id))
    }
    else{
        next(new ElementNotFound())
    }
})

router.patch("/albums/:id",(req,res,next) => {
    if (req.body.name || req.body.year ){
        if (unqController.containsidAlbum(req.params.id)){
            res.status(200)
            res.json(unqController.UpdateAlbum(req.params.id,req.body))
        }
        else{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
 
})

router.delete("/albums/:id",(req,res,next) => {
    if (unqController.containsidAlbum(req.params.id)){
        res.status(204)
        unqController.RemoveAlbum(req.params.id)
        res.send("Album Eliminado")
    }
    else{
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

router.get("/tracks/:id/lyrics",(req,res,next)=> {
    if (unqController.containsIdTrack(req.params.id)){
        res.status(200)
        
        res.json(unqController.getLyrics(req.params.id))
    }
    else{
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