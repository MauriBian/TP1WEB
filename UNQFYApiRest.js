const express = require('express')
const UNQfy = require('./commands')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);

router.post("/artists",(req,res) => res.json(req.body))

router.get("/artists/:id",(req,res) => res.json("hola"))




app.listen(port);
console.log('Api Ready! ' + port);