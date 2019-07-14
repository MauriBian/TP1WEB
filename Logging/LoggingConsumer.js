const rp = require('request-promise');
const url = 'http://localhost:5003/'
const options = {
    url: '',
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
    },
    json: true,
};
class LoggingConsumer {

    NotificarElementoAgregado(elementoAgregado) {
      
        rp.post(url +'logging/info/',{json: {mensaje : `El ${elementoAgregado.constructor.name} con nombre ${elementoAgregado.name} fue agregado a UNQFY {Info} \n`}})
    }

    NotificarElementoEliminado(elementoEliminado) {
        rp.post(url+'logging/warning/',{json: {mensaje : `El ${elementoEliminado.constructor.name} con nombre ${elementoEliminado.name} fue Eliminado de UNQFY {Warning} \n`}})
    }

    NotificarError(error){
        rp.post(url + 'logging/error/',{json:{mensaje: error.message}})
    }

    
}
module.exports={
    LoggingConsumer : LoggingConsumer
}