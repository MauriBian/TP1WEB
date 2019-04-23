const Searchable = require ('./searchable.js');

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
    try{
      this.addToAlbums(album);
    }
    catch(exception){
      console.log( exception.message);
    }
  }

  addToAlbums(album){
    if(! this.hasAlbum(album.id)){
      this.albums.push(album);
    }
    else{
      throw new Error("El album ya se encuentra en la lista de albums del artista");
    }
  }

  hasAlbum(albumId){
    return this.albums.map((album)=>album.id).includes(albumId);
  }
}

module.exports = {Artist : Artist};
