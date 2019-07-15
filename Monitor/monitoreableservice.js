const rp = require('request-promise');

class MonitoreableService{
    constructor (name,ApiEP,notifyCallback){
        this.ApiEP = ApiEP;
        this.lastStatus = "";
        this.notifyCallback = notifyCallback;
        this.name = name;
    }



    checkStatus(){
        let status = "";
        rp.get(this.ApiEP)
        .then( resp => {
            console.log("El servidor funciona");
            status = "ON";
            if (this.shouldNotify(status)){
                this.lastStatus = status;
                this.notifyCallback(this);
            }
        })
        .catch( error => {
            console.log("El Servidor No funciona");
            status = "OFF";
            if (this.shouldNotify(status)){
                this.lastStatus = status;
                this.notifyCallback(this);
            }
        })

       
    }

    shouldNotify(status){
        console.log ("LAST STATUS: " + this.lastStatus);
        console.log("STATUS:" + status);
        return this.lastStatus !== status;
    }
}

module.exports ={
    MonitoreableService: MonitoreableService
}