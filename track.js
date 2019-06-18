const Searchable = require ('./searchable.js');
const MusixMatch = require ('./musixmatchClient.js');
const musixMatchClient = new MusixMatch.MusixMatchClient();

class Track extends Searchable{
  constructor(_id, _name, _duration, _genres = []){
    super (_id, _name);
    this.duration = _duration;
    this.genres = _genres;
    this.lyrics = "";
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

  getLyrics(artistName){ 
    if((this.lyrics !== "")){
      console.log("------Letra: ");
      return(this.lyrics);
    }
    else{
      console.log('-------Actualizando letra... ')
      let track = musixMatchClient.searchTrack(this.getName(), artistName);  
      return musixMatchClient.getLyrics(track)
      .then((response)=> {
        this.lyrics=response;
        return ('------Letras actualizadas - Intente nuevamente')} );
    }
  }
}


module.exports = {Track : Track};
