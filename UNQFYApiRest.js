const express = require('express')
const app = express()
const unqController = require('./UNQFYController')
const errorsMod = require('./errors')
const ArtistNotFound = errorsMod.ArtistNotFound
const ArtistAlreadyExistsError = errorsMod.ArtistAlreadyExistsError
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);
app.use(errorHandler); 


router.post("/artists",(req,res,next) => {
if (req.params.name != undefined && req.params.country != undefined)   {
    if (!unqController.containsArtist(req.body)){
        let artist = unqController.addArtist(req.body)
        res.status(201)
        res.json({
            "id" : artist.id,
            "name" : artist.name,
            "albums" : artist.albums,
            "country" : artist.country})
        }
    else {
        next(new ArtistAlreadyExistsError())
    }
}
else{
    next(new SyntaxError())
} 
})
 

router.get("/artists/:id",(req,res,next) => {
    if (unqController.getArtistById(req.params.id)){
        res.status(200)
        res.json(unqController.parseAlbumsArtist(unqController.getArtistById(req.params.id)))
    }
    else{
        next(new ArtistNotFound())
    }})



router.put("/artists/:id",(req,res,next) => {
    if (unqController.getArtistById(req.params.id)){
        res.status(200)
        if (req.body.name != undefined && req.body.country != undefined){
            res.json(unqController.updateArtist(parseInt(req.params.id),req.body))
        }
        else{
            next(new SyntaxError())
        }
        
    }
    else{
        next(new ArtistNotFound())
    }}
)

router.delete("/artists/:id",(req,res,next) => {res.status(204)
    if (unqController.getArtistById(req.params.id)){
    unqController.RemoveArtist(req.params.id)
    }
    else{
        next(new ArtistNotFound())
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

function errorHandler(err,req,res,next){
    console.log(err)
    if (err instanceof ArtistAlreadyExistsError){
        res.status(409)
        res.json({
            status : 409,
            errorCode : "RESOURCE_ALREADY_EXISTS"})
    }
    if (err instanceof ArtistNotFound){
        res.status(404)
        res.json({
            status : 404,
            errorCode : "RESOURCE_NOT_FOUND"})
    }
    if (err instanceof SyntaxError){
        res.status(400)
        res.json({
            status : 400,
            errorCode : "BAD_REQUEST"
        })
    }

    if (err instanceof Error){
        res.status(500)
        res.json({
            status : 500,
            errorCode : "INTERNAL_SERVER_ERROR"
        })
    }    
    
    else{
        next()
    }
    
}

app.listen(port);
console.log('Api Ready! ' + port);