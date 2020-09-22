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

    static async giveTokenForUser(username, password){
        const user = {id:0, username:'admin', password:config.dashboardPassword};
        
        if(username != user.username && password != user.password)
            throw 'Invalid username or password';
    
        const token = jwt.sign({
            id:user.id,
            username:user.username,
        },
        config.secret,
        {expiresIn:'1d'});
        return {
            ...User.omitUserPassword(user),
            token
        }
    }

    static async getCurrent(request, response, next){
        response.json({"token":jwt.verify(request.headers.authorization.split(" ")[1], config.secret)});
    }

    static authenticate(request, response, next){
        User.giveTokenForUser(request.body.username, request.body.password)
            .then(user=>response.json(user))
            .catch(next);
    }
}

router.post('/authenticate', User.authenticate)
router.get('/current', User.getCurrent);
module.exports = router;