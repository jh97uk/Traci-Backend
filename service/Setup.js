const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi')
const Schema = require('../ValidationSchema.js');
const editJsonFile = require("edit-json-file");

class Setup{  

    static setupEstablishment(request, response, next){
        var validation = Schema.Establishment.validate(request.body);
        if(validation.error)
            throw new Error(validation.error.message);
        let configJsonFile = editJsonFile(`${__dirname}/../config.json`);
        configJsonFile.set('establishmentName', request.body.establishmentName);
        configJsonFile.set('establishmentMessage', request.body.establishmentMessage);
        configJsonFile.save();
        response.send({status:'success'});
    }

    static checkPasswordSetStatus(request, response, next){
        let configJsonFile = editJsonFile(`${__dirname}/../config.json`);
        const password = configJsonFile.get('dashboardPassword');
        if(password == '' || password == undefined){
            response.send({status:'setup-required'});
        } else{
            response.send({status:'setup-complete'});
        }
    }
}

router.get('/', Setup.checkPasswordSetStatus);
router.post('/establishment', Setup.setupEstablishment)
router.patch('/establishment', Setup.setupEstablishment);
module.exports = router;