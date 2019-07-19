const Searchable = require ('./searchable.js');
const errorsMod = require('./errors');
const ElementAlreadyExistsError = errorsMod.ElementAlreadyExistsError
const NotificadorMod = require('./Notificador')
const Notificador = NotificadorMod.Notificador
const notificador = new Notificador()

class Artist extends Searchable{
  constructor(_id, _name, _country, _albums = []){
    super (_id, _name);
    this.country = _country;
    this.albums = _albums;
  }

  getCountry(){
    return this.country;
  }

  getAlbums(){
    return this.albums;
  }

  setCountry(country){
    this.country = country;
  }

  setAlbums(albums){
    this.albums = albums;
  }

  addAlbum(album){
    if(! this.hasAlbum(album.name)){
      this.albums.push(album);
    }
    else{
      let error = new ElementAlreadyExistsError(`El album ${album.name} ya se encuentra en la lista de albums del artista`);
      notificador.NotificarError(error)
      throw error
    }
  }

  hasAlbum(albumName){
    return this.albums.map((album)=>album.name).includes(albumName);
  }

  removeAlbum(album){
    this.albums.pop(album);
  }
}

module.exports = {Artist : Artist};
