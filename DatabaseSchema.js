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
    })
}

sequelize.sync({force:true})

module.exports = {
    Tables: Tables
}