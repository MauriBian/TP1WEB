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
        rp.post(url +'logging/addElement/',{json: {'tipo': typeof elementoAgregado,
                                                   'name': elementoAgregado.name,}})
    }
    
}
module.exports={
    LoggingConsumer : LoggingConsumer
}