const rp = require ('request-promise');
const BASE_URL = 'http://api.musixmatch.com/ws/1.1';


const options = {
    uri: '',
    qs: {
    apikey: '86f3dbc599889e4c161cb40cf7724820',
    },
    json: true 
    };

class MusixMatchClient{

    searchTrack(trackName, artist){
        options.uri = BASE_URL + '/track.search'
        options.qs.q_track= trackName;
        
        options.qs.q_artist= artist; 
        //se agrega el artista para que coincida mejor las letras

        return rp.get(options)
        
    }


    getLyrics(trackPromise){
        return trackPromise
        .then((response) => {
            let track = response.message.body.track_list[0].track;
            if (track.has_lyrics == 1){
            let id = track.track_id
            
            options.uri = BASE_URL + '/track.lyrics.get?track_id='+id;  
            
            return rp.get(options).then((response)=> {
                return response.message.body.lyrics.lyrics_body})
            }

            else{
                return Promise.resolve("Lyrics no disponibles en MusixMatch")}
           
        }).catch((error)=> console.log("Error al traer las lyrics de MusixMatch. "+ error.message))
    }
}

module.exports = {MusixMatchClient : MusixMatchClient};