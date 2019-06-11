const Searchable = require ('./searchable.js');
const errorsMod = require('./errors');
const ElementAlreadyExistsError = errorsMod.ElementAlreadyExistsError

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
      throw new ElementAlreadyExistsError("El album ya se encuentra en la lista de albums del artista");
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
