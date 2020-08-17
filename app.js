const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {Sequelize, TIME} = require("sequelize");
const Schema = require('./ValidationSchema.js');

const port = 4000;
const sequelize = new Sequelize("postgres://traci:tracie@localhost:54320/traci");
app.use(bodyParser.json());

app.post ('/', function(request, response){
    var validation = Schema.phoneNumber.validate(request.query);
    if(validation.error){
        throw new Error(validation.error.message);
    }
    response.send({status:request.query});
});

app.use(function(error, request, response, next){
    response.status(500).send({message:error.message});
})
app.listen(port, function(){
    console.log("Listening!");
})


