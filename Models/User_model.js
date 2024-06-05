const Sequelize= require('sequelize');
const sequelize = require('../Helper/database');

const user = sequelize.define('users',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,

    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports= user;