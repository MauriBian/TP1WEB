const express = require('express')
const app = express()
const unqController = require('./UNQFYController')

const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);

router.post("/artists",(req,res) => {let artist = unqController.addArtist(req.body)
res.status(201)
res.json({
    "id" : artist.id,
    "name" : artist.name,
    "country" : artist.country,
    "albums" : artist.albums
})})

router.get("/artists",(req,res) => {res.status(200)
res.json(unqController.parseArtist(unqController.getArtistById(req.query.id)))})


app.listen(port);
console.log('Api Ready! ' + port);