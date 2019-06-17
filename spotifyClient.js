const rp = require('request-promise');
const options = {
                    url: '',
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json', 
                        'Authorization': ' Bearer ' + 'BQBJskpZWStafaqVUMY__TJAGHh1aqC3YlEPNuKaQhxyrYbgzqrQQYmjUzyMchnkGhszOwkRhiOri9V8ueu1OOS5Dr4D6CdUHb5lnxle10goQTMu1H6IFIE_xHlABkBHnrvupY-tFL4Ao1oCrg' 
                    },
                    json: true,
                };

class SpotifyClient {
    
    findArtist (artistName){
        options.url = 'https://api.spotify.com/v1/search?q=' + artistName +'&type=artist&market=US&limit=1&offset=0';
        return rp.get(options);
    }

    getArtistAlbums(artistName){
        return this.findArtist(artistName)
        .then(response =>  response.artists.items[0].id   )
        .then ( (resp) =>  ('https://api.spotify.com/v1/artists/' + resp +'/albums?include_groups=single%2Cappears_on&market=US&limit=30&offset=0') )
        .then ((resp) => {
            options.url = resp;
            return rp.get(options);
        } )
        .catch ( e => console.log ("ERROR" + e))
        

    }
}module.exports = {SpotifyClient : SpotifyClient};
