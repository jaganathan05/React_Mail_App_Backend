const Sequelize= require('sequelize');
const sequelize = require('../Helper/database');

const Allmails = sequelize.define('Allmails',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    sender:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    receiver:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    subject:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    content:{
        type: Sequelize.TEXT,
        allowNull: false,

    } ,
    read : {
        type: Sequelize.BOOLEAN,
        allowNull : false
    },
    delete:{
        type: Sequelize.BOOLEAN,
        allowNull : false
    }

})

module.exports= Allmails;