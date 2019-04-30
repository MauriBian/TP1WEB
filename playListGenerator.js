const playListMod = require('./playlist.js')
const PlayList = playListMod.Playlist

class PlayListGenerator{
  constructor(tracks) {
    this.tracks= tracks;
  }
    
  getTracksMatchingGenres(genres,tracks) {
    return tracks.filter(track => this.containsGen(track,genres));
  }
    
  containsGen(track,genres){
    return genres.some(elem => track.genres.includes(elem));
  }

  getTracksMatching(genres,duration,tracks){
    return this.ReduceByTime(this.getTracksMatchingGenres(genres,tracks),duration);
  }

  ReduceByTime(tracks,duration){
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

  CreatePlayList(id,name, genresToInclude, maxDuration){
    let playList = new PlayList(id,name,genresToInclude,maxDuration,this.getTracksMatching(genresToInclude,maxDuration,this.tracks))
    return playList;
  }
}


module.exports = {PlayListGenerator : PlayListGenerator};