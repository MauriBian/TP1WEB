const Searchable = require ('./searchable.js');
const errorsMod = require('./errors')
const TrackAlreadyExistsError = errorsMod.TrackAlreadyExistsError

class Album extends Searchable{
  constructor(_id, _name, _year, _artist){
    super(_id, _name);
    this.year = _year;
    this.tracks = [];
    this.artist = _artist;
  }

  getYear(){
    return this.year;
  }

  getTracks(){
    return this.tracks;
  }

  getArtist(){
    return this.artist;
  }

  setYear(year){
    this.year = year;
  }

  setTracks(tracks){
    this.tracks = tracks;
  }

  setArtist(artist){
    this.artist = artist;
  }

  addTrack(track){
    try{
      this.addTrackToAlbum(track);
    }
    catch(exception){
      console.log( exception.message);
    }
  }

  addTrackToAlbum(track){
    if(! this.hasTrack(track.name)){
      this.tracks.push(track);
    }
    else{
      throw new TrackAlreadyExistsError("El track ya existe en el album");
    }
  }

  hasTrack(trackName){
    return this.tracks.map((track)=>track.name).includes(trackName);
  }
}

module.exports = {Album : Album};
