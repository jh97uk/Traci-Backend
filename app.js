const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const Schema = require('./ValidationSchema.js');
const Database = require('./DatabaseSchema.js');
const { Sequelize } = require('sequelize');

const port = 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());



app.post ('/customer/entry', function(request, response){
    var validation = Schema.phoneNumber.validate(request.body);
    if(validation.error){
        throw new Error(validation.error.message);
    }
    Database.Tables.Customers.create({
        phoneNumber:request.body.number,
        entryTimestamp: new Date().getTime()
    })
    response.send({message:'success'});
});

app.use(function(error, request, response, next){
    response.status(500).send({message:error.message});
})
app.listen(port, function(){
    console.log("Listening!");
})


