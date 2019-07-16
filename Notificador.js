const LoggingConsumerMod = require('./LoggingConsumer')
const LoggingConsumer = LoggingConsumerMod.LoggingConsumer
const notifier = require('./notifierManager')

class Notificador {
    constructor() {
        this.suscriptores = [new LoggingConsumer()]
        this.notifierSub = new notifier.NotifierManager()
    }
    NotificarElementoAgregado(elementoAgregado) {
        this.suscriptores.forEach(elem => elem.NotificarElementoAgregado(elementoAgregado))
    }

    NotificarElementoEliminado(elementoEliminado){
        this.suscriptores.forEach(elem => elem.NotificarElementoEliminado(elementoEliminado))
    }

    NotificarError(error){
        this.suscriptores.forEach(elem => elem.NotificarError(error))
    }

    Suscribirse(suscriptor){
        this.suscriptores.push(suscriptor)
    }

    EliminarSuscripcion(suscriptor){
        this.suscriptores = this.suscriptores.filter(elem => elem == suscriptor)
    }


    //Mensajes para la api de notificacion, para enviar mails a los suscriptores
    notifyAlbumAdded(artistId, artistName, albumName){
        this.notifierSub.manageAlbumAdded(artistId, artistName, albumName)
    }

    notifyArtistRemoved(artistId){
        this.notifierSub.manageArtistRemoved(artistId)
    }
}

module.exports ={
    Notificador: Notificador
}