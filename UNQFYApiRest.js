const express = require('express')
const app = express()
const unqController = require('./UNQFYController')

const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);

router.post("/artists",(req,res) => {let artist = unqController.addArtist(req.body)
res.status(201)
res.json({
    "id" : artist.id,
    "name" : artist.name,
    "albums" : artist.albums,
    "country" : artist.country,
    
})})

router.get("/artists/:id",(req,res) => {res.status(200)
res.json(unqController.parseAlbumsArtist(unqController.getArtistById(req.params.id)))})


router.put("/artists/:id",(req,res) => {res.status(200)
res.json(unqController.updateArtist(req.params.id,req.body))})


app.listen(port);
console.log('Api Ready! ' + port);