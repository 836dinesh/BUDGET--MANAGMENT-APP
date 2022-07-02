const Sequelize=require('sequelize')
const sequelize=require('../utils/database')

const Expence=sequelize.define('expence',{
    id:{ type:Sequelize.INTEGER,
     autoIncrement:true,
     allowNull:false,
     primaryKey:true,
    },
    expence:{
     type:Sequelize.STRING,
     allowNull:false
     },
     Description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    }
 })
 module.exports = Expence