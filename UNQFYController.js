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

function addArtist(artistJson){
    let unq = getUNQfy()
    let artist = unq.addArtist(artistJson)
    saveUNQfy(unq)
    return artist

}

function parseAlbumsArtist(artistObj){

  artistObj.albums = artistObj.albums.map(elem => AlbumWithoutArtist(elem))
  return artistObj
}

 function getArtistById(id){
  return  parseAlbumsArtist(getUNQfy().getArtistById(id)) 
}

function AlbumWithoutArtist(album){
  return {name : album.name,
          year : album.year,
          track : album.tracks}
}   

function updateArtist(id,artistObj){
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

function RemoveArtist(id){
  let unq= getUNQfy()
  unq.RemoveArtist(id)
  saveUNQfy(unq)
}

function getArtistByName(name){
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

function containsIdArtist(id){
  return getUNQfy().containsArtistById(id)
}

function containsArtist(name){

  return getUNQfy().containsArtistByName(name)
}

function containsidAlbum(id){
  return getUNQfy().containsidAlbum(id)
}

function containsAlbumByName(name){
  return getUNQfy().containsAlbumByName(name)
}

function addAlbum(albumData){
  let unq = getUNQfy()
  let album = unq.addAlbum(albumData.artistId,{name : albumData.name,
                                   year : albumData.year})
  saveUNQfy(unq)
  return AlbumWithoutArtist(album)
}

module.exports = {
    addArtist,
    getArtistById,
    parseAlbumsArtist,
    updateArtist,
    RemoveArtist,
    getArtistByName,
    containsArtist,
    containsIdArtist,
    containsidAlbum,
    containsAlbumByName,
    addAlbum
}