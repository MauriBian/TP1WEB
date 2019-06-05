const rp = require('request-promise');
const options = {
                    url: '',
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json', 
                        'Authorization': ' Bearer ' + 'BQCXIWYsGDelSXlJDs9Yc1pDLXFXSFZeld7y9-1MhPhpt-TFlHW_1h5-LZt6fJAKnXDreGdlFLs69ny81WEsbxJ_OzL8lQn0LJcnoBV7T28cvX78pqXzzOeMWUbiXBXZaFqX9oAmQCc-PCXGJg' 
                    },
                    json: true,
                };

class SpotifyClient {
    
    findArtist (artistName){
        options.url = 'https://api.spotify.com/v1/search?q=' + artistName +'&type=artist&market=AR&limit=1&offset=1';
        return rp.get(options);
    }

    getArtistAlbums(artistName){
        return this.findArtist(artistName)
        .then(response =>  response.artists.items[0].id   )
        .then ( (resp) =>  ('https://api.spotify.com/v1/artists/' + resp +'/albums?include_groups=single%2Cappears_on&market=ES&limit=30&offset=0') )
        .then ((resp) => {
            options.url = resp;
            return rp.get(options);
        } )
        

    }
}module.exports = {SpotifyClient : SpotifyClient};
