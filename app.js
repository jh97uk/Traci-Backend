const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const Schema = require('./ValidationSchema.js');
const Database = require('./DatabaseSchema.js');
const jwt = require('./helper/jwt.js');
const errorHandler = require('./helper/ErrorHandler.js');
const { Sequelize } = require('sequelize');
const { date } = require('@hapi/joi');

const port = 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(jwt());

app.use('/users', require('./service/User.js'));

app.use(errorHandler);

var isThisLocalhost = function (req){
    var ip = req.connection.remoteAddress;
    var host = req.get('host');
    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

app.post ('/customer/entry', function(request, response){
    if(!isThisLocalhost)
        throw new Error("This request can only be performed by the kiosk its hosted on!")
    
    var validation = Schema.phoneNumber.validate(request.body);
    if(validation.error)
        throw new Error(validation.error.message);
    
    Database.Tables.Customers.count({
        where:{
            phoneNumber: request.body.number,
            departureTimestamp: null
        }
    }).then(function(customerWithNumberCount){
        if(customerWithNumberCount == 0){
            Database.Tables.Customers.create({
                phoneNumber:request.body.number,
                entryTimestamp: new Date().getTime()
            }).then(function(test){
                response.send({message:'success', type:'entry'});
            })
        } else{
            Database.Tables.Customers.update({departureTimestamp:new Date().getTime()}, {
                where:{
                    phoneNumber:request.body.number,
                    departureTimestamp:null
                }
            }).then(function(){
                response.send({message:'success', type:'departure'});
            })
        }
    })
});

app.use(function(error, request, response, next){
    response.status(500).send({message:error.message});
})
app.listen(port, function(){
    console.log("Listening!");
})


