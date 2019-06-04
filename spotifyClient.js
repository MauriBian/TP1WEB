const rp = require('request-promise');
const options = {
                    url: '',
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json', 
                        'Authorization': ' Bearer ' + 'BQAjILV_YZbbPwc-ffIcXcXk3dfh5j1co7kXzYrEbHUpEswykW2pzyHHGHuzXJVPzoa7i8ZXW1l-2KSsK5Y4-ABLDcsLtrl3zE4gNB2sWySAmLG7PODyf9CsauvTjzScKo1upjBEX-wIOlPYig' 
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
