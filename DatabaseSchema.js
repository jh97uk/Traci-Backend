const {Sequelize, TIME, DataTypes} = require("sequelize");
const sequelize = new Sequelize("postgres://traci:tracie@localhost:54320/traci");

var Tables = {
    Customers: sequelize.define('customers', {
        'id': {
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        'phoneNumber':{
            type: DataTypes.STRING,
            max:16,
            min:12,
            allowNull:false
        },
        'entryTimestamp': {
            type:Sequelize.DATE,
            allowNull:false
        },
        'departureTimestamp':{
            type:Sequelize.DATE
        }
    }),
    Users: sequelize.define('users', {
        'id':{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        'username':{
            type:DataTypes.STRING,
            max:20,
            min:2,
            allowNull:false
        },
        'password':{
            type:DataTypes.STRING,
            max:120,
            min:20,
            allowNull:false
        }
    })
}

sequelize.sync({force:true})

module.exports = {
    Tables: Tables
}