const unqmod = require("./unqfy")
const fs = require('fs'); 
const NotificadorMod = require('./Notificador')
const Notificador = NotificadorMod.Notificador
const notificador = new Notificador()

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
    notificador.NotificarElementoAgregado(artist)
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
  return {
          id : album.id,
          name : album.name,
          year : album.year,
          tracks : album.tracks}
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
  let artist = unq.getArtistById(id)
  notificador.NotificarElementoEliminado(artist)
  unq.RemoveArtist(id)
  saveUNQfy(unq)
}

function getArtistsByName(name){
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
  return getUNQfy().containsAlbumById(id)
}

function containsAlbumByName(name){
  return getUNQfy().containsAlbumByName(name)
}

function containsIdTrack(id){
  return getUNQfy().containsIdTrack(id)
}

function UpdateAlbum(id,albumObj){
  let unq = getUNQfy()
  let album = unq.getAlbumById(id)
  let newAlbum = album
  newAlbum.name = albumObj.name || album.name
  newAlbum.year = albumObj.year || album.year
  unq.RemoveAlbum(album.id)
  unq.addAlbumWithID(newAlbum.artist.id,newAlbum,newAlbum.id)
  saveUNQfy(unq)
  return AlbumWithoutArtist(newAlbum)
}

function RemoveAlbum(id){
  let unq = getUNQfy()
  album = unq.getAlbumById(id)
  notificador.NotificarElementoEliminado(album)
  unq.RemoveAlbum(id)
  saveUNQfy(unq)
}

function addAlbum(albumData){
  let unq = getUNQfy()
  let album = unq.addAlbum(
    albumData.artistId,
    {name : albumData.name,
    year : albumData.year})
  notificador.NotificarElementoAgregado(album)
  saveUNQfy(unq)
  return AlbumWithoutArtist(album)
}

function addTrack(trackData){
  let unq = getUNQfy()
  let track = unq.addTrack(trackData.albumId,{
    name : trackData.name,
    duration : trackData.duration,
    genres : trackData.genres
  })
  notificador.NotificarElementoAgregado(track)
  saveUNQfy(unq)
  return track
}

function getAlbumById(id){
  return AlbumWithoutArtist(getUNQfy().getAlbumById(id))
}

function getAlbumsByName(name){
  return getUNQfy().getAlbumsByName(name).map(elem => AlbumWithoutArtist(elem))
}

function saveLyrics(idTrack){
  let unq = getUNQfy()
  let track = unq.getTrackById(idTrack)
  const promise = Promise.resolve(track.getLyrics())
  return promise.then((lyrics)=>{
    console.log(lyrics)
    saveUNQfy(unq)
  })

}

function RemoveTrack(idTrack){
  let unq = getUNQfy()
  let track = unq.getTrackById(idTrack)
  notificador.NotificarElementoEliminado(track)
  unq.RemoveTrack(idTrack)
  saveUNQfy(unq)
}

function getLyrics(idTrack){
  let unq = getUNQfy()
  saveLyrics(idTrack)
  let track = unq.getTrackById(idTrack)
  return track.lyrics
}

module.exports = {
    addArtist,
    getArtistById,
    parseAlbumsArtist,
    updateArtist,
    RemoveArtist,
    getArtistsByName,
    containsArtist,
    containsIdArtist,
    containsidAlbum,
    containsAlbumByName,
    addAlbum,
    getAlbumById,
    UpdateAlbum,
    RemoveAlbum,
    getAlbumsByName,
    containsIdTrack,
    getLyrics,
    addTrack,
    RemoveTrack
}