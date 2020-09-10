module.exports = errorHandler;

function errorHandler(error, request, response, next){
    if(error.name === 'UnauthorizedError'){
        return response.status(401).json({error:'Invalid token!'});
    } else{
        return response.status(500).json({error:error.message});
    }
}