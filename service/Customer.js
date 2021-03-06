const express = require("express");
const router = express.Router();
const Schema = require('../ValidationSchema.js');
const Database = require('../DatabaseSchema.js');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const { response } = require("express");
const Joi = require("@hapi/joi");

var isThisLocalhost = function (req){
    var ip = req.connection.remoteAddress;
    var host = req.get('host');
    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

class Customer{
    static getAll(request, response){
        let options = {limit:5};
        const validation = Schema.CustomerSearch.validate(request.params);
        if(validation.error)
            throw new Error(validation.error.message);
        if(request.params.id)
            options = {where:{id:request.params.id}, limit:5}
            else if(request.params.number)
                options = {where:{
                        phoneNumber:{
                            [Op.like]: '%'+request.params.number+'%'
                        },
                    
                    }}
        
        if(request.query.startDate && request.query.endDate)
            options['where'] = {...options.where, ...{
                entryTimestamp:{
                    [Op.gte]: request.query.startDate
                },
                departureTimestamp:{
                    [Op.ne]: null,
                    [Op.lte]: request.query.endDate
                }
            }}
        
        if(request.query.offset)
            options['offset'] = request.query.offset;
            
        Database.Tables.Customers.findAll(options).then(function(data){
            response.send(data);
        })
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
                if(request.body.entryTimestamp && request.body.departureTimestamp){
                    Database.Tables.Customers.create({
                        phoneNumber:request.body.number,
                        entryTimestamp: request.body.entryTimestamp,
                        departureTimestamp: request.body.departureTimestamp
                    }).then(function(data){
                        response.send({message:'success', type:'entry', entry:data.dataValues});
                    })
                } else{
                    Database.Tables.Customers.create({
                        phoneNumber:request.body.number,
                        entryTimestamp: new Date().getTime()
                    }).then(function(test){
                        response.send({message:'success', type:'entry'});
                    })
                }
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

    static patch(request, response){
        var validation = Schema.Customer.validate(request.body);
        if(validation.error)
            throw new Error(validation.error.message);
        Database.Tables.Customers.update(request.body, {
            where:{
                id:parseInt(request.params.id)
            },
            returning:true
        }).then(function(test){
            response.send({message:'success', entry:test[1][0].dataValues});
        })
    }

    static deleteEntry(request, response){
        if(request.params.id != null || request.params.id != undefined){
            const validation = Joi.number().validate(request.params.id);
            if(validation.error)
                throw new Error(validation.error.message);
    
            Database.Tables.Customers.destroy({where:{id:request.params.id}}).then(function(result){
                response.send({message:'success'});
            })
        } else{
            Database.Tables.Customers.destroy({
                where:{},
                truncate:true
            }).then(function(result){
                response.send({message:'success'});
            })
        }
        
    }
}

router.get('/search/:number?', Customer.getAll)
router.get('/:id?', Customer.getAll)

router.post("/entry", Customer.new);
router.patch('/:id', Customer.patch)
router.delete("/", Customer.deleteEntry);
router.delete('/:id', Customer.deleteEntry);
module.exports = router;