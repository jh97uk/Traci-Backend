const config = require('../config.json');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi')

const editJsonFile = require("edit-json-file");
class Setup{
    static initConfig(){
        let configJsonFile = editJsonFile(`${__dirname}/../config.json`);
        configJsonFile.set('secret', Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
        configJsonFile.save();
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
module.exports = router;