const LoggingConsumerMod = require('./Logging/LoggingConsumer')
const LoggingConsumer = LoggingConsumerMod.LoggingConsumer
class Observer {
    constructor() {
        this.suscriptores = [new LoggingConsumer()]
    }
    NotificarElementoAgregado(elementoAgregado) {
        this.suscriptores.forEach(elem => elem.NotificarElementoAgregado(elementoAgregado) )
    }

    Suscribirse(suscriptor){
        this.suscriptores.push(suscriptor)
    }

    EliminarSuscripcion(suscriptor){
        this.suscriptores = this.suscriptores.filter(elem => elem == suscriptor)
    }
}

module.exports ={
    Observer: Observer
}