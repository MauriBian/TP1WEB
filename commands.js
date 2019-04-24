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
    genre: argus.slice(3)
  }

  getUNQfy().addTrack(argus[0],trackData)
  saveUNQfy(unqInst)
}

const _removeTrack = function(argus){
  const unqInst = getUNQfy();
  
  getUNQfy().RemoveTrack(argus[0])
  saveUNQfy(unqInst)
}

const _removeAlbum = function(argus){
  const unqInst = getUNQfy();
  
  getUNQfy().RemoveAlbum(argus[0])
  saveUNQfy(unqInst)
}

const _removeArtist = function(argus){
  const unqInst = getUNQfy();
  
  getUNQfy().RemoveArtist(argus[0])
  saveUNQfy(unqInst)
}

const _searchSongsByArtist = function (argus){
  const unqInst = getUNQfy();
  unqInst.getTracksMatchingArtist(argus[0]);
  saveUNQfy(unqInst);
}

const _searchSongsByGenre = function (argus){
  const unqInst = getUNQfy();
  unqInst.getTracksMatchingGenres(argus[0]);
  saveUNQfy(unqInst);
}

const _createPlaylist = function (argus){
  const unqInst = getUNQfy();
  unqInst.createPlaylist(argus[0],argus[1],argus[2])
  saveUNQfy(unqInst);
}

const comandos = {
  addArtist  : _addArtist,
  addTrack : _addTrack,
  addAlbum : _addAlbum,
  removeArtist : _removeArtist,
  removeAlbum : _removeAlbum,
  removeTrack : _removeTrack,
  searchSongByArtist : _searchSongsByArtist,
  searchSongsByGenre : _searchSongsByGenre,
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



  