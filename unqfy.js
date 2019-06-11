
const picklify = require('picklify'); // para cargar/guardar unqfy
const fs = require('fs'); // para cargar/guardar unqfy
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
const MusixMatchClientMod = require('./musixmatchClient')
const MusixMatchClient = MusixMatchClientMod.MusixMatchClient
const errorsMod = require('./errors')
const ElementAlreadyExistsError = errorsMod.ElementAlreadyExistsError
const ElementDoesntExistsError = errorsMod.ElementDoesntExistsError
const ArtistNotFound = errorsMod.ArtistNotFound

class UNQfy {
  constructor() {
    this.artists = [];
    this.playLists = [];
    this.playListgenerator = new PlayListGenerator();
    this.lastId = 0;
  }
  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData, id= 1) {
  /* Crea un artista y lo agrega a unqfy.El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */ 
    if(! this.containsArtist(artistData.name)){
      let artist = new Artist(this.lastId,artistData.name,artistData.country);
      this.lastId += 1;
      this.artists.push(artist);
      return artist;
    }
    else{
      throw new ElementAlreadyExistsError("El/La artista "+artistData.name+ " ya se encuentra en el sistema");
    }
  }
  
  addArtistWithID(artistData,id){
    
    if(! this.containsArtist(artistData.name)){
      let artist = new Artist(id,artistData.name,artistData.country);
      this.artists.push(artist);
      return artist;
    }
    else{
      throw new ElementAlreadyExistsError("El/La artista "+artistData.name+ " ya se encuentra en el sistema");
    }
  }
  

  containsArtist(artistName){
    return this.artists.map(art => art.getName()).includes(artistName);
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
      let artist =  this.getArtistById(artistId);
      let album = new Album(this.lastId,albumData.name,albumData.year,artist);
      this.lastId+= 1;
      artist.addAlbum(album);
      return album;
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
    let albums = this.getAllAlbums();
    let album =  albums.find(a=> a.getId() == albumId);
    let track = new Track(this.lastId,trackData.name,trackData.duration,trackData.genres);
    this.lastId += 1;
    album.addTrack( track)
    return track;
  }


  getAllAlbums(){
    return this.flat(this.artists.map(a => a.getAlbums()));
  }

  getAllTracks(){
    return this.flat(this.getAllAlbums().map(a=> a.getTracks()));
  }

  RemoveArtist(artistId){
    let artist = this.getArtistById(artistId);

    if (artist != undefined){

      let tracks = this.getTracksMatchingArtist(artistId)  
      if (this.playLists.length > 0){
        this.playLists.forEach(elem => elem.removeTracks(tracks));
      }
      
      this.artists = this.removeElement(artistId,this.artists)
      
    }

     else{
      throw new ElementDoesntExistsError ("Error : El artista que intenta borrar no existe");
    }
  }

  removeElement(id,list){
    return list.filter(elem => elem.id != id)
  }
  
  RemoveAlbum(albumId){
    let album = this.getAlbumById(albumId);
    if(! album === undefined){ 
      album.artist.removeAlbum(album);
      if (this.playLists.length > 0){
        this.playLists.forEach(elem => elem.removeTracks(album.tracks));
      }
    }
    else{
      throw new ElementDoesntExistsError ("Error: El album que intenta borrar no existe");
    }
  }

  RemoveTrack(id){
    let track = this.getTrackById(id);
    if (! track === undefined) {
      let album = this.getAllAlbums().find(elem => elem.tracks.includes(track));
      if (this.playLists.length > 0){
        this.playLists.forEach(elem => {if (elem.tracks.includes(track)){elem.tracks.pop(track)}} );
      }
      album.removeTrack();
    }
    else{
      throw new ElementDoesntExistsError ("Error: El track que intenta borrar no existe");
    }
  }


  RemovePlayList(id){
    let playlist = this.getPlaylistById(id);
    if (! playlist === undefined){
    this.playLists.pop(this.getPlaylistById(id));
    }
    else{
      throw new ElementDoesntExistsError ("Error: La playlist que intenta borrar no existe");
    }
  }


  getArtistById(id) {
    return this.artists.find(elem => elem.id == id);
  }

  getAlbumById(id) {
    return this.getAllAlbums().find(elem => elem.id == id);
  }

  getTrackById(id) {
    return this.getAllTracks().find(elem => elem.id == id);
  }

  getPlaylistById(id) {
    return this.playLists.find(elem => elem.id == id);
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    return this.playListgenerator.getTracksMatchingGenres(genres,this.getAllTracks())
  }

  containsGen(track,genres){
    return genres.some(elem => track.genres.includes(elem))
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistId) {
    let artist =  this.getArtistById(artistId)
    return this.flat(artist.getAlbums().map(album => album.getTracks()));

  }

  flat (list){
    if (list.length>0){
      return list.reduce( (a, b) => a.concat(b));
    }
    else{
      return []
    }
  
  }

  searchByName(name){

    let artistfiltered = this.artists.filter(elem => elem.name.includes(name))
    let albumfiltered = this.getAllAlbums().filter(elem => elem.name.includes(name))
    let trackfiltered = this.getAllTracks().filter(elem => elem.name.includes(name))
    let playListfiltered = this.playLists.filter(elem => elem.name.includes(name))
    return {artists : artistfiltered,
    albums : albumfiltered,
    tracks : trackfiltered,
    playlists : playListfiltered}

  }

  getArtistsByName(name){
    return this.artists.filter(elem => elem.name.toLowerCase().includes(name))
  }

  getArtistByName(artistName){
    return this.artists.find(elem => elem.name == artistName)
  }  

  getAllArtists(){
    return this.artists
  }

  getAllAlbumsOfAnArtist(idArtist){
   let artist =  this.getArtistById(idArtist)
   return artist.getAlbums();

  }

  getAllTracksOfAnAlbum(idAlbum){
    let album = this.getAlbumById(idAlbum)
    return album.getTracks();
  }

  getAlbumsForArtist(artistName){
    if (this.artists.find(elem => elem.name == artistName) != null){
      let albumsArtist = this.artists.find(elem => elem.name == artistName).albums
      let albums = albumsArtist.map(elem => this.createObject(elem) )
      return albums
    }
    else{
      throw new ArtistNotFound()
    }
  

    

    
  }

  createObject(album){
    return {name : album.name,
            year : album.year,
            track : album.tracks}
  }         

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude , maxDuration ) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */
      let newplayList =this.playListgenerator.createPlayList(this.lastId,name,genresToInclude,maxDuration, this.getAllTracks())
      this.lastId+= 1
      this.playLists.push(newplayList)
      return newplayList;
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
    const classes = [UNQfy,Artist,Album,Track,PlayListGenerator,PlayList, MusixMatchClient];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}


// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy
};


