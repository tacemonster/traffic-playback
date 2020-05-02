//This class will be responsible for processing data sent from the server
//to the client. An instance of this class will be part of the playback's component state.
// More elaborate descrptions avsailable below.
class HTTPClientEndPoint {
    constructor(){
        //this.setState holds a reference to the state object
        this.keyHandlerStore = {} 
    }

    //This function maps key (most likely urls) -> handler functions
    // When  a HTTPServiceComponent sends a request to a specific url on the 
    //server it will recieve a response which should also have a copy of said specific url value
    // This function registers a handler function which can then be used to process data 
    // sent as the result of sending requests to a specific url. For example, GET /routelist will may return a route list [route1,route2,route3],
    // and handlerfunction can be used to process that route list and pass it off to appstate.
    registerUrlStateHandler(key,handlerFunction) {
        //Here I check that the url/key is a string type and that 
        //handlerfunction is indeed a function object.
        let urlTypeCheck = (typeof key === "string");
        let functionTypeCheck = (handlerFunction !== undefined && handlerFunction instanceof Object) && (handlerFunction.prototype === Function.prototype);

        //if both checks pass, then assign the function as a callback to the handlerstore.
        if(urlTypeCheck && functionTypeCheck)
            this.keyHandlerStore[key] = handlerFunction
    }

    processHTTPresponse(key,data){
        //Here, I check that type of url is string, and 
        // I have forgone checking the data for now.
        // I don't know if there are scenarious where data 
        // could be empty and yet we would still like to run 
        //  a particular handler mapped to a key.
        let keyTypeCheck = (typeof key === "string");
        let handlerFunction = this.keyHandlerStore[key]
        let functionTypeCheck = (handlerFunction !== undefined && handlerFunction instanceof Object) && (handlerFunction.prototype === Function.prototype);

        
        //if key and handlerfunction are valid.,
        if(keyTypeCheck && functionTypeCheck){
            handlerFunction(data) //pass off data to handlerfunction which should update playback state.
        }
        
    }
}

export default HTTPClientEndPoint;