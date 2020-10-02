const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const errorHandler = require('./helper/ErrorHandler.js');
const Setup = require('./service/Setup.js');
const editJsonFile = require("edit-json-file");

const port = 4000;
let authMiddlewarePresent = false;
const configJsonFile = editJsonFile(`${__dirname}/config.json`);
if(Object.keys(configJsonFile.data).length == 0){
    configJsonFile.set('secret', Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
    configJsonFile.save();
}

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(function(request, response, next){
    const config = editJsonFile(`${__dirname}/config.json`).toObject();
    if(!config.dashboardPassword){
        if(request.url == "/users" || request.url == '/setup')
            next();
        else{
            response.status(500).send({message:"Admin setup required!"})
        }
    } else{
        if(!authMiddlewarePresent){
            authMiddlewarePresent = true;
            const jwt = require('./helper/jwt.js');
            app.use(jwt());
        }
        
        next();
    }
})

app.use(errorHandler);
app.use('/kiosk', require('./service/Kiosk.js'));
app.use('/users', require('./service/User.js'));
app.use('/customer', require('./service/Customer.js'))
app.use('/setup', require('./service/Setup.js'));

app.use(function(error, request, response, next){
    response.status(500).send({message:error.message});
})

app.listen(port, function(){
    console.log("Listening!");
})