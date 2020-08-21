module.exports = errorHandler;

function errorHandler(error, request, response, next){
    if(error.name === 'UnauthorizedError'){
        return response.status(401).json({message:'Invalid token!'});
    } else{
        return response.status(500).json({message:error.message});
    }
}