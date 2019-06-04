const rp = require('request-promise');
const options = {
                    url: '',
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json', 
                        'Authorization': ' Bearer ' + 'BQAFh8I4jcOW7pWLJIZu4Q4_LSjEMmMC_N0vGTfSIJ6djyTXNgiagZx4gjW8h2gzN-5BYzcuK7an3inGNokqhNjzFZyCxrKNsDv25qBni1jDMYS6sWHh3fQHxqougsQ7aGyEKxSRxL6RhlQMWw' 
                    },
                    json: true,
                };

class SpotifyClient {
    
    findArtist (artistName){
        options.url = 'https://api.spotify.com/v1/search?q=' + artistName +'&type=artist&market=US&limit=1&offset=1';
        return rp.get(options);
    }

    getArtistAlbums(artistName){
        return this.findArtist(artistName)
        .then(response =>  response.artists.items[0].id   )
        .then ( (resp) =>  ('https://api.spotify.com/v1/artists/' + resp +'/albums?include_groups=single%2Cappears_on&market=ES&limit=10&offset=5') )
        .then ((resp) => {
            options.url = resp;
            return rp.get(options);
        } )
        

    }
}module.exports = {SpotifyClient : SpotifyClient};
