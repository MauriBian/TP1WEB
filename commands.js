const addElement = function (obj, added){
    try {
        console.log(`Agregado ${added} a ${obj}`)
    }catch (error){
        console.log("ERROR")
    } 
}

const removeElement = function (obj, toRemove){
    try {
        console.log(`Eliminar ${toRemove} de ${obj}`)
    }catch (error){
        console.log("ERROR")
    } 
}

const listElement = function (obj){
    console.log("LISTADO DE" + obj);
}


const addArt = function (added){  addElement("Artista",added);}
const removeArt = function(toRemove) { removeElement("Artista", toRemove) }
const addSong = function (added){    addElement("Track",added); }
const removeSong = function(toRemove) { removeElement("Track", toRemove) }
const addAlbum = function (added){    addElement("Album",added); }
const removeAlb = function(toRemove) { removeElement("Album", toRemove) }
const ListArtist = function () { listElement("Artistas") }
const ListAlbums = function () { listElement("Albums") }
const ListSongs = function () { listElement("Canciones") }




const comandos = {
  addArtist  : addArt,
  addTrack : addSong,
  addAlbum : addAlbum,
  removeArtist : removeArt,
  removeTrack : removeSong,
  removeAlbum : removeAlb,
  listArtist : ListArtist,
  listAlbum : ListAlbums,
  listTrack : ListSongs
};

var argIndex = 0;
function executeIfExists(argum,argumList){
    argIndex ++

    if (argIndex != 3){
        return;
    }
    
    if ( argIndex == 3  ){
        
        if (comandos[argum] != undefined){
            
            comandos[argum](argumList[3]);
        }else{
            console.log("No existe ese comando");
        } 
    }

  }

module.exports = {
    comandos,executeIfExists
  };



  