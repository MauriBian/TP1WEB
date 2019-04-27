const Searchable = require ('./searchable.js');

class Playlist extends Searchable{
  constructor(_id, _name, _genres = [], _duration, _tracks = []){
      super (_id, _name);
      this.genres = _genres;
      this.duration = _duration;
      this.tracks = _tracks;
  }

  getDuration(){
    return this.duration;
  }

  getTracks(){
    return this.tracks;
  }

  getGenres(){
    return this.genres;
  }

  setDuration(duration){
    this.duration = duration;
  }

  setTracks(tracks){
    this.tracks = tracks;
  }

  setGenres(genres){
    this.genres = genres;
  }

  hasTrack(aTrack){
   return  this.tracks.includes(aTrack)
  }

  removeTracks(trackList){
    
    trackList.forEach(elem => {if (this.tracks.includes(elem)){this.tracks.pop(elem)}})
  }
}



module.exports = {Playlist : Playlist};
