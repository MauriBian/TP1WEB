const express = require('express')
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

router.post("/addElement",(req,res,next) => {
    const logg = `El ${req.body.tipo} con nombre ${req.body.name} fue agregado a UNQFY {Info} \n`
    WriteFile(logg)
    res.json(logg)
})

router.post('/elementRemoved',(req,res,next)=>{
    const logg = `El ${req.body.tipo} con nombre ${req.body.name} fue eliminado de UNQFY {Warning}\n`
    WriteFile(logg)
    res.json(logg)
})

router.post('/error',(req,res,next)=> {
    const logg = req.body.mensaje + ' {Error}\n'
    WriteFile(logg)
    res.json(logg)
})




app.listen(port);
console.log('Logging Api Ready! ' + port);