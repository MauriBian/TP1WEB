const unqmod = require("./unqfy")
const fs = require('fs'); 

function getUNQfy(filename = 'data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
  
  function saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
  }

const addArtist = function(artistJson){
    let unq = getUNQfy()
    let artist = unq.addArtist(artistJson)
    saveUNQfy(unq)
    return artist

}

const getArtistById = function(id){
  return getUNQfy().getArtistById(id)
}

const parseArtist = function(artistObj){
  artistObj.albums = getUNQfy().getAlbumsForArtist(artistObj.name)
  return artistObj
}



module.exports = {
    addArtist,
    getArtistById,
    parseArtist
}