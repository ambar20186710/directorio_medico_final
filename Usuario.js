const db = require('./db.js');
const DataTypes = require("sequelize");

const Publicacion = db.define('publicacion',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    servicios: {
        type: DataTypes.STRING
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto: {
        type: DataTypes.BLOB,
    },
    horario:{
        type: DataTypes.STRING
    },
    numero:{
        type: DataTypes.STRING(10)
    }
})

module.exports = Publicacion;
