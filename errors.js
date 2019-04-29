
class ArtistAlreadyExistsError extends Error{
    constructor(message){
        super(message);
        this.name = "ArtistAlreadyExistsError";
    }
}


class AlbumAlreadyExistsError extends Error{
    constructor(message){
        super(message);
        this.name = "AlbumAlreadyExistsError";
    }
}


class TrackAlreadyExistsError extends Error{
    constructor(message){
        super(message);
        this.name = "TrackAlreadyExistsError";
    }
}

module.exports = {
    ArtistAlreadyExistsError : ArtistAlreadyExistsError,
    AlbumAlreadyExistsError : AlbumAlreadyExistsError,
    TrackAlreadyExistsError : TrackAlreadyExistsError

};

