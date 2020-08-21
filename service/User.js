const config = require('../config.json');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Database = require('../DatabaseSchema.js');



class User{
    static omitUserPassword(user){
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }

    static async giveTokenForUser({username, password}){
        const user = {id:0, usernmae:'admin', password:'123'};
    
        if(username == user.username && password == user.password)
            throw 'Invalid username or password';
    
        const token = jwt.sign({
            sub:user.id
        },
        config.secret,
        {expiresIn:'1d'});
    
        return {
            ...User.omitUserPassword(user),
            token
        }
    }

    static authenticate(request, response, next){
        User.giveTokenForUser(request.body)
            .then(user=>response.json(user))
            .catch(next);
    }
}

router.post('/authenticate', User.authenticate)
module.exports = router;