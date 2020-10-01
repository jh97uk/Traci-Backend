const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const errorHandler = require('./helper/ErrorHandler.js');
const SetupHelper = require('./service/Setup.js');
const jwt = require('./helper/jwt.js');
const editJsonFile = require("edit-json-file");

const port = 4000;
let authMiddlewarePresent = false;
const configJsonFile = editJsonFile(`${__dirname}/config.json`);
if(Object.keys(configJsonFile.data).length == 0){
    SetupHelper.initConfig(configJsonFile);
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
            app.use(jwt());
        }
        
        next();
    }
})

app.use(errorHandler);
app.use('/users', require('./service/User.js'));
app.use('/customer', require('./service/Customer.js'))
app.use('/setup', require('./service/Setup.js'));

app.use(function(error, request, response, next){
    response.status(500).send({message:error.message});
})

app.listen(port, function(){
    console.log("Listening!");
})