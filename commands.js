const m = require('./main')
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const spotifyClient = require('./spotifyClient');
const spotifyInstance = new spotifyClient.SpotifyClient();
// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
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



const _addArtist = function(argus){
  const unqInst = getUNQfy();
  const artistData = {
    name : argus[0],
    country: argus[1]
  }
  unqInst.addArtist(artistData)
  saveUNQfy(unqInst)
}

const _addAlbum = function(argus){
  const unqInst = getUNQfy();
  const albumData = {
    name : argus[1],
    year: argus[2]
  }

  unqInst.addAlbum(argus[0],albumData)
  saveUNQfy(unqInst)
}

const _addTrack = function(argus){
  const unqInst = getUNQfy();
  const trackData = {
    name : argus[1],
    duration: argus[2],
    genres: argus.slice(3)
  }

  unqInst.addTrack(argus[0],trackData)
  saveUNQfy(unqInst)
}

const _removeTrack = function(argus){
  const unqInst = getUNQfy();
  
  unqInst.RemoveTrack(argus[0])
  saveUNQfy(unqInst)
}

const _removeAlbum = function(argus){
  const unqInst = getUNQfy();
  
  unqInst.RemoveAlbum(argus[0])
  saveUNQfy(unqInst)
}

const _removeArtist = function(argus){
  const unqInst = getUNQfy();
  
  unqInst.RemoveArtist(argus[0])
  saveUNQfy(unqInst)
}

const _searchSongsByArtist = function (argus){
  const unqInst = getUNQfy();
  unqInst.getTracksMatchingArtist(argus[0]).forEach ( x => console.log(x));
  saveUNQfy(unqInst);
}

const _searchSongsByGenre = function (argus){
  const unqInst = getUNQfy();
  unqInst.getTracksMatchingGenres(argus).forEach ( x => console.log(x));
  saveUNQfy(unqInst);
}

const searchArtistByName = function(artistName){
  const unqInst = getUNQfy();
  return unqInst.getArtistByName(artistName);
}

const _createPlaylist = function (argus){
  const unqInst = getUNQfy();
  unqInst.createPlaylist(argus[0],argus.slice(2), argus[1])
  saveUNQfy(unqInst);
}

const _getAllArtist = function(){
  const unqInst = getUNQfy();
  const artists = unqInst.getAllArtists();
  artists.forEach ( x => console.log(x.name));
}

const _getAllArtistAlbums = function(argus){
  const unqInst = getUNQfy();
  const albums = unqInst.getAllAlbumsOfAnArtist(argus[0]);
  albums.forEach ( x => console.log(x.name));
}

const _getAllAlbumTracks = function(argus){
  const unqInst = getUNQfy();
  const tracks = unqInst.getAllTracksOfAnAlbum(argus[0]);
  tracks.forEach ( x => console.log(x.name));
}

const _getAlbumsForArtist = function (artistName){
  try{
    const unqInst = getUNQfy();
    const albums = unqInst.getAlbumsForArtist(artistName)
    console.log(albums)
  }
  catch(error){
    console.log(error.name)
  }

  
}

const _populateAlbumsForArtist = function (artistName){
  try {
    let id = searchArtistByName(artistName).id;
  }catch(e){
    console.log("NO existe el artista en la BD");
  }

 
   spotifyInstance.getArtistAlbums(artistName)
   .then ( resp => resp.items)
   .then ( items => {
      items.forEach( album => { 
        _addAlbum([id,album.name, album.release_date.substring(0,4)])
       console.log("Album agregado: " + album.name);
      });
   } )
   .catch(error =>  {
     console.log(error.name)
   })
  
}

const _searchByName = function(argus){
  const unqInst = getUNQfy();
  const elems  = unqInst.searchByName(argus[0]);
  console.log("Artistas: " );
  elems.artists.forEach (x => console.log(x));
  console.log("Albumes: " );
  elems.albums.forEach (x => console.log(x));
  console.log("Tracks: " );
  elems.tracks.forEach (x => console.log(x));
  console.log("Playlist: " );
  elems.playlists.forEach (x => console.log(x));
}

const _help = function (argus){
  console.log("- addArtist [nombre] [nacionalidad] :  Agrega un artista con su nombre y nacionalidad")
  console.log("- addTrack [albumID] [nombreAlbum] [genero1] [genero2] [genero3] ...  : Agrega un track al album ")
  console.log("- addAlbum [artist ID] [album Name] [album Year] : Agrega un album")
  console.log ("- removeArtist [artistID] : borra el artista")
  console.log ("- removeAlbum [albumID] : borra el album")
  console.log ("- removeTrack [trackID] : borra la cancion")
  console.log("- getAllArtist : Lista todos los artistas")
  console.log("- getAllArtistAlbums [artistID] : devuelve todos los albums del artista")
  console.log("- searchSongsByArtist [artistID] : devuelve todas las canciones del artista")
  console.log("- searchSongsByGenre [genero1] [genero2] ... : devuelve los tracks que sean de los generos mencionados")
  console.log("- searchByName [name]: busca tracks, artistas, playlist y albums por el nombre")
  console.log("- createPlaylist [name] [duration] [genero1] [genero2]..  : crea una playList en base a la duracionMaxima y generos elegidos")
  console.log("- getAlbumsForArtist [artistName] : devuelve todos los albums de un artista dado")
  console.log ("- populateAlbumsForArtist [artistName] consulta a Spotify los albums del artista y los devuelve ")
}

const comandos = {
  addArtist  : _addArtist,
  addTrack : _addTrack,
  addAlbum : _addAlbum,
  removeArtist : _removeArtist,
  removeAlbum : _removeAlbum,
  removeTrack : _removeTrack,
  getAllArtist : _getAllArtist,
  getAllArtistAlbums : _getAllArtistAlbums,
  getAllAlbumTracks : _getAllAlbumTracks,
  searchSongsByArtist : _searchSongsByArtist,
  searchSongsByGenre : _searchSongsByGenre,
  searchByName : _searchByName,
  createPlaylist : _createPlaylist,
  getAlbumsForArtist : _getAlbumsForArtist,
  populateAlbumsForArtist : _populateAlbumsForArtist,
  help : _help

};


  function executeIfExists(argumList){
    const posibleComando = argumList[2];
    const argumentos = argumList.slice(3, argumList.length )

        
        if ( posibleComando in comandos ){
            
            comandos[posibleComando](argumentos);
        }else{
            console.log("No existe ese comando");
        } 

  }


module.exports = {
    executeIfExists
  };

  