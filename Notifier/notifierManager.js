
const rp = require ('request-promise');

const notificationAPI_URL = 'http://172.18.0.4:5002/api';
const options = {
    uri: '',
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
    },
    body: {},
    json: true 
    };

class NotifierManager{

    manageAlbumAdded(artistId, artistName, albumName){
        options.uri = notificationAPI_URL + '/notify'
        options.body = {
            artistId: artistId,
            subject: `Nuevo album para el/la artista ${artistName}`,
            message: `Se ha agregado el album ${albumName} al artista ${artistName}`,
         }

        rp.post(options);
    }

    manageArtistRemoved(artistId){
        options.uri = notificationAPI_URL + '/subscriptions'
        options.body = {
            artistId: artistId,
         }

        rp.delete(options);
    }

}

module.exports = {NotifierManager: NotifierManager}