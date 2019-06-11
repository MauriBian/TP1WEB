
class ElementAlreadyExistsError extends Error{
    constructor(message){
        super(message);
        this.name = "ElementAlreadyExistsError";
    }
}

class ElementDoesntExistsError extends Error{
    constructor(message){
        super(message);
        this.name = "ElementDoesntExistsError";
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
    ElementAlreadyExistsError : ElementAlreadyExistsError,
    ElementDoesntExistsError : ElementDoesntExistsError,
    TrackAlreadyExistsError : TrackAlreadyExistsError, //sacar despues de subir lo nuevo de track
    ArtistNotFound : ArtistNotFound,


};

