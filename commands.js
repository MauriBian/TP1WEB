const m = require('./main')
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy

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
  createPlaylist : _createPlaylist

};

// var argIndex = 0;
// function executeIfExistsOld(argumList){
//     argIndex ++

//     if (argIndex != 3){
//         return;
//     }
    
//     if ( argIndex == 3  ){
        
//         if (comandos[argum] != undefined){
            
//             comandos[argum](argumList[3]);
//         }else{
//             console.log("No existe ese comando");
//         } 
//     }

//   }

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



  