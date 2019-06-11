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
        // por si se agrega artist, no era necesario en el tp
        //pero asi coincide la bien la letra que se busca

        return rp.get(options)
    }


    getLyrics(track){
        return track
        .then((response) => {
            let track = response.message.body.track_list.find(tracks => (tracks.track.has_lyrics == 1)) 
            //por ahora busco uno que si tenga lyrics para mostrar
            let id = track.track.track_id
            options.uri = BASE_URL + '/track.lyrics.get?track_id='+id;  
            return rp.get(options)

        })       
    }
}

module.exports = {MusixMatchClient : MusixMatchClient};