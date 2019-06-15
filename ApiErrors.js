class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
    super(message || name);
    this.name = name;
    this.status = statusCode;
    this.errorCode = errorCode;
    }   
 }
 class ElementAlreadyExistsError extends APIError{
     constructor(){
         super("ElementAlreadyExistsError",409,"RESOURCE_ALREADY_EXISTS")
     }
 }

 class ElementNotFound extends APIError{
     constructor(){
         super("ElementNotFound", 404 , "RESOURCE_NOT_FOUND")
     }
 }

 class RelatedElementNotFound extends APIError{
     constructor(){
         super("RelatedElementNotFound",404,"RELATED_RESOURCE_NOT_FOUND")
     }
 }

 module.exports={
     ElementAlreadyExistsError: ElementAlreadyExistsError,
     ElementNotFound : ElementNotFound,
     RelatedElementNotFound : RelatedElementNotFound,
     Errores : [ElementAlreadyExistsError,ElementNotFound,RelatedElementNotFound]
 }