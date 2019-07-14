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

    loggly.logTest("probando 1 2 3")
    WriteFile(req.body.mensaje)
    res.json(req.body.mensaje)
})

router.post('/warning',(req,res,next)=>{
    WriteFile(req.body.mensaje)
    res.json(req.body.mensaje)
})

router.post('/error',(req,res,next)=> {
    loggly.logTest("probando 1 2 3")
    const logg = req.body.mensaje + ' {Error}\n'
    WriteFile(logg)
    res.json(logg)
})




app.listen(port);
console.log('Logging Api Ready! ' + port);