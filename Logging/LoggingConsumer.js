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
      
        rp.post(url +'logging/addElement/',{json: {'tipo': elementoAgregado.constructor.name,
                                                   'name': elementoAgregado.name,}})
    }

    NotificarElementoEliminado(elementoEliminado) {
        rp.post(url+'logging/elementRemoved/',{json: {'tipo': elementoEliminado.constructor.name,
                                                    'name': elementoEliminado.name}})
    }

    NotificarError(error){
        rp.post(url + 'logging/error/',{json:{mensaje: error.message}})
    }

    
}
module.exports={
    LoggingConsumer : LoggingConsumer
}