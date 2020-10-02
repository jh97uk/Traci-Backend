const express = require('express');
const router = express.Router();
const editJsonFile = require("edit-json-file");

class Kiosk{  
    static getInformation(request, response, next){        
        let configJsonFile = editJsonFile(`${__dirname}/../config.json`);
        response.send({establishment:{name:configJsonFile.data.establishmentName, message:configJsonFile.data.establishmentMessage}});
    }
}

router.get('/', Kiosk.getInformation);
module.exports = router;