const express = require("express");
const router = express.Router();
const Schema = require('../ValidationSchema.js');
const Database = require('../DatabaseSchema.js');
const { Sequelize } = require('sequelize');

var isThisLocalhost = function (req){
    var ip = req.connection.remoteAddress;
    var host = req.get('host');
    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

class Customer{
    static getAll(){

    }
    
    static new(request, response){
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
    }
}

router.get('/', Customer.getAll)
router.post("/entry", Customer.new);
module.exports = router;