class MonitorMessage{

    constructor(service){
        this.service = service;
        this.mensajeDeRestaablecimiento = "[ON]El servidor volvió a funcionar ";
        this.mensajeDeCayoServer = "[OFF]El servidor dejo de funcionar ";
    }

    Notify(){
        let msg = "";
        const dat = new Date();
        if (this.service.lastStatus == "ON"){
            msg = this.mensajeDeRestaablecimiento ; 
        }else{
            msg = this.mensajeDeCayoServer;
        }
        return   "[" + this.service.name + "]" + msg + dat.toDateString() + 'a las: ' + dat.getHours() + ':' + dat.getMinutes() + ':' + dat.getSeconds() + ' ]';
    }
}

module.exports ={
    MonitorMessage: MonitorMessage
}