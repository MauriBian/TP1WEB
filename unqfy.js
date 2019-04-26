
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const artistMod = require('./artist')
const Artist = artistMod.Artist
const albumMod= require('./album')
const Album = albumMod.Album
const trackMod = require('./track')
const Track = trackMod.Track
const playListMod = require('./playlist')
const PlayList = playListMod.Playlist
const playListGeneratorMod = require('./playListGenerator')
const PlayListGenerator = playListGeneratorMod.PlayListGenerator

class UNQfy {
  constructor() {
    this.artists = []
    this.tracks = []
    this.albums = []
    this.playLists = []
    this.playListgenerator = new PlayListGenerator(this.tracks)
    this.lastId = 0
  }
  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
 
      let artist = new Artist(this.lastId,artistData.name,artistData.country,artistData.albums)
      this.lastId += 1
      this.artists.push(artist)
      return artist
    

 
  
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */

      let artista =  this.getArtistById(artistId)
      let album = new Album(this.lastId,albumData.name,albumData.year,artista)
      this.lastId+= 1
      artista.albums.push(album)
      this.albums.push(album)
      return album
    


  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
 
    let track = new Track(this.lastId,trackData.name,trackData.duration,trackData.genres)
    this.lastId += 1
    this.getAlbumById(albumId).tracks.push(track)
    this.tracks.push(track)
    return track


  }

  RemoveArtist(id){
    let artist = this.getArtistById(id)
    this.artists.pop(artist)
    let tracks = this.getTracksMatchingArtist(artist.name)
    tracks.foreach(elem => this.tracks.pop(elem))
  }

  RemoveAlbum(id){
    this.albums.pop(this.getArtistById(id))
  }

  RemoveTrack(id){
    this.tracks.pop(this.getArtistById(id))
  }


  RemovePlayList(id){
    this.playLists.pop(getArtistById(id))
  }


  getArtistById(id) {
    return this.artists.find(elem => elem.id == id)
  }

  getAlbumById(id) {
    return this.albums.find(elem => elem.id == id)
  }

  getTrackById(id) {
    return this.tracks.find(elem => elem.id == id)
  }

  getPlaylistById(id) {
    return this.playLists.find(elem => elem.id == id)
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    return this.playListgenerator.getTracksMatchingGenres(genres,this.tracks)
  }

  containsGen(track,genres){
    return genres.some(elem => track.genres.includes(elem))
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artist =  this.artists.find(art => art.name === artistName)
    return artist.albums.map(album => album.tracks)

  }

  searchByName(name){

    let artistfiltered = this.artists.filter(elem => elem.name.includes(name))
    let albumfiltered = this.albums.filter(elem => elem.name.includes(name))
    let trackfiltered = this.tracks.filter(elem => elem.name.includes(name))
    let playListfiltered = this.playLists.filter(elem => elem.name.includes(name))
    return {artists : artistfiltered,
    albums : albumfiltered,
    tracks : trackfiltered,
    playlists : playListfiltered}

  }

  getAllArtists(){
    return this.artists
  }

  getAllAlbumsOfAnArtist(idArtista){
   let artista =  this.getArtistById(idArtista)
   return artista.albums

  }

  getAllTracksOfAnAlbum(idAlbum){
    let album = this.getAlbumById(idAlbum)
    return album.tracks
  }

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, maxDuration, genresToInclude ) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

      let newplayList =this.playListgenerator.CreatePlayList(this.lastId,name,genresToInclude,maxDuration)
      this.lastId+= 1
      this.playLists.push(newplayList)
      return newplayList
  
   


  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy,Artist,Album,Track,PlayListGenerator,PlayList];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}




// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
  Artist,
  Album,
  Track,
  PlayList,
  PlayListGenerator

};


