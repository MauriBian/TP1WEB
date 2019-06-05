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

const parseAlbumsArtist = function(artistObj){
  artistObj.albums = getUNQfy().getAlbumsForArtist(artistObj.name)
  return artistObj
}

const updateArtist = function(id,artistObj){
  let unq = getUNQfy()
  let artist = getArtistById(id)
  let newArtist = artist
  newArtist.name = artistObj.name
  newArtist.country = artistObj.country
  unq.RemoveArtist(id)
  unq.addArtistWithID(newArtist,id)
  saveUNQfy(unq)
  return parseAlbumsArtist(newArtist)

}

const RemoveArtist = function(id){
  let unq= getUNQfy()
  unq.RemoveArtist(id)
  saveUNQfy(unq)
}

const getArtistByName= function(name){
  let unq = getUNQfy()
  return parseArtist(unq.getArtistsByName(name))
}

function parseArtist(list){
  return list.map(elem => ArtistToObject(elem))
}

function ArtistToObject(artist){
  return {
    id : artist.id,
    name: artist.name,
    albums : artist.albums,
    country : artist.country
  }
}

function containsArtist(artist){
  return getUNQfy().getArtistByName(artist)
}

module.exports = {
    addArtist,
    getArtistById,
    parseAlbumsArtist,
    updateArtist,
    RemoveArtist,
    getArtistByName,
    containsArtist
}