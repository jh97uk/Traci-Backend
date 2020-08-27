const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('./helper/jwt.js');
const errorHandler = require('./helper/ErrorHandler.js');

const port = 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(jwt());

app.use('/users', require('./service/User.js'));
app.use('/customer', require('./service/Customer.js'))
app.use(errorHandler);

app.use(function(error, request, response, next){
    response.status(500).send({message:error.message});
})
app.listen(port, function(){
    console.log("Listening!");
})


