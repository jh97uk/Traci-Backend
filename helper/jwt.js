const expressJwt = require('express-jwt');
const config = require("../config.json");


function jwt(){
    const {secret} = config;
    return expressJwt({secret, algorithms:['HS256']}).unless({
        path:[
            '/users/authenticate',
            '/customer/entry',
            '/kiosk'
        ]
    })
}
module.exports = jwt;
