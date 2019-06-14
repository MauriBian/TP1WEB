const Searchable = require ('./searchable.js');
const MusixMatch = require ('./musixmatchClient.js');

class Track extends Searchable{
  constructor(_id, _name, _duration, _genres = []){
    super (_id, _name);
    this.duration = _duration;
    this.genres = _genres;
    this.lyrics = "";
    this.mmclient = new MusixMatch.MusixMatchClient();
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

  getLyrics(unqinst){ 
    if(this.lyrics !== ""){
      console.log("Letra: ")
      console.log(this.lyrics)
      return this.lyrics;
    }else{
      console.log("Actualizando letra... ")
      let track = this.mmclient.searchTrack(this.getName());  
      return this.mmclient.getLyrics(track)
      .then((response) => {
      this.lyrics= response.message.body.lyrics.lyrics_body
      console.log('Letras actualizadas - Intente nuevamente')
      unqinst.save('data.json');
      return response.message.body.lyrics.lyrics_body;
      })
    }
    
    }
  }


module.exports = {Track : Track};
