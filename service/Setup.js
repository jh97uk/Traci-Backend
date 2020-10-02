const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi')

const editJsonFile = require("edit-json-file");

class Setup{  
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
module.exports = router;