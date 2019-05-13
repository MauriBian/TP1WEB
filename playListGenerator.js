const playListMod = require('./playlist.js')
const PlayList = playListMod.Playlist

class PlayListGenerator{
    
  getTracksMatchingGenres(genres,tracks) {
    return tracks.filter(track => this.containsGen(track,genres));
  }
    
  containsGen(track,genres){
    return genres.some(elem => track.genres.includes(elem));
  }

  getTracksMatching(genres,duration,tracks){
    return this.reduceByTime(this.getTracksMatchingGenres(genres,tracks),duration);
  }

  reduceByTime(tracks,duration){
    let time = 0
    let newTracks = []
  
    while( tracks.length > 0 && time <= duration ){
      if (time + tracks[0].duration <= duration) {
        time += tracks[0].duration;
        newTracks.push(tracks[0]);
        tracks.shift();
      }
      else{
        tracks.shift();
      } 
    }
      return newTracks;
    }

  createPlayList(id,name, genresToInclude, maxDuration, tracks){
    let playList = new PlayList(id,name,genresToInclude,maxDuration,this.getTracksMatching(genresToInclude,maxDuration, tracks))
    return playList;
  }
}


module.exports = {PlayListGenerator : PlayListGenerator};