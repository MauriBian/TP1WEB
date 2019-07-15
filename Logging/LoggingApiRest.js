const express = require('express')
const loggly = require('./LogglyConsumer')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5003;
const router = express.Router();
const fs = require('fs');
const filename = 'loggs.json'
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/logging', router);

function WriteFile(logg){

    fs.appendFileSync(filename,logg)
}

router.post("/info",(req,res,next) => {
    loggly.NotificarInfo(req.body.mensaje)
    WriteFile(req.body.mensaje)
    res.json(req.body.mensaje)
})

router.post('/warning',(req,res,next)=>{
    loggly.NotificarWarning(logg)
    WriteFile(req.body.mensaje)
    res.json(req.body.mensaje)
})

router.post('/error',(req,res,next)=> {
    const logg = req.body.mensaje + ' {Error}\n'
    loggly.NotificarError(logg)
    WriteFile(logg)
    res.json(logg)
})

router.get('/status', (req,res,next) => {
    res.status(200);
    res.json("OK");
})




app.listen(port);
console.log('Logging Api Ready! ' + port);