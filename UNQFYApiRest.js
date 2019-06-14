const express = require('express')
const app = express()
const unqController = require('./UNQFYController')
const apiErrors = require("./ApiErrors")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);



router.post("/artists",(req,res,next) => {


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
    if (unqController.containsIdArtist(req.params.id)){
        res.status(200) 
        res.json(unqController.updateArtist(parseInt(req.params.id),req.body))
      
    }
    else{
        next(new ElementNotFound())
    }}
)

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
    res.json(unqController.getArtistByName(req.query.name))
    }
    else{
        res.status(200)
        res.json(unqController.getArtistByName(""))
    }

})

router.post("/albums",(req,res,next) => {
    if (!unqController.containsAlbumByName(req.body.name)){
        if(unqController.containsIdArtist(req.body.artistId)){
            res.status(200)
            res.json(unqController.addAlbum(req.body))
        }
        else{
            next(new RelatedElementNotFound())
        }
    }
    else{
        next(new ElementAlreadyExistsError())
    }
})

function errorHandler(err,req,res,next){
    console.log(err)
    if (err instanceof ElementAlreadyExistsError){
        res.status(err.status)
        res.json({
            status : err.status,
            errorCode : err.errorCode})
    }
    if (err instanceof ElementNotFound){
        res.status(err.status)
        res.json({
            status : err.status,
            errorCode : err.errorCode})
    }
    if (err instanceof SyntaxError){
        res.status(400)
        res.json({
            status : 400,
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