const Searchable = require ('./searchable.js');

class Track extends Searchable{
  constructor(_id, _name, _duration, _genres = []){
    super (_id, _name);
    this.duration = _duration;
    this.genres = _genres;
  }

  getDuration(){
    return this.duration;
  }

  getGenres(){
    return this.genres;
  }

  setDuration(duration){
    this.duration = duration;
  }

  setGenres(genres){
    this.genres = genres;
  }

  hasAnyGenre(genres){
    return (genres.filter((genre)=> this.hasGenre(genre))).length > 0;
  }

  hasGenre(genre){
    return this.genres.includes(genre);
  }

}

module.exports = Track;
