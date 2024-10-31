const { Sequelize } = require('sequelize');
// Carga las variables de entorno
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Asegúrate de usar el dialecto correcto
  }
);

// Exporta la conexión a la base de datos
module.exports = sequelize;
