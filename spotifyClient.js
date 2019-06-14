const rp = require('request-promise');
const options = {
                    url: '',
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json', 
                        'Authorization': ' Bearer ' + 'BQAHHqnd_Dyvv7DZrK873Tgtoweu3TOA0p_dB5AmhzShMEw5FFg40CbEBcoxBx0djh3jind545Z9xDteHJwfVF_-GgmIEKWY2wgzO9_TRTqX6KLaeAuIEHzqFiuyfderCnFNq3lUShbEUP3mFw' 
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
        

    }
}module.exports = {SpotifyClient : SpotifyClient};
