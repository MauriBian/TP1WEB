
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

class ArtistNotFound extends Error{
    constructor(message){
        super(message);
        this.name = "Artist Not Found"
    }
}



module.exports = {
    ArtistAlreadyExistsError : ArtistAlreadyExistsError,
    AlbumAlreadyExistsError : AlbumAlreadyExistsError,
    TrackAlreadyExistsError : TrackAlreadyExistsError,
    ArtistNotFound : ArtistNotFound,


};

