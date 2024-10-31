// Importa la clase Sequelize desde el paquete 'sequelize'
const { Sequelize } = require('sequelize');

// Carga las variables de entorno desde un archivo .env
// Esto permite mantener la información sensible fuera del código fuente
require('dotenv').config();

// Crea una nueva instancia de Sequelize para conectarse a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre de la base de datos desde las variables de entorno
  process.env.DB_USER,      // Usuario de la base de datos desde las variables de entorno
  process.env.DB_PASSWORD,  // Contraseña de la base de datos desde las variables de entorno
  {
    host: process.env.DB_HOST,        // Host de la base de datos (ej. 'localhost')
    dialect: 'postgres',               // Especifica el dialecto de la base de datos que se está utilizando, en este caso, PostgreSQL
  }
);

// Exporta la instancia de Sequelize para que pueda ser utilizada en otras partes de la aplicación
module.exports = sequelize;


//SEQUELIZE Sequelize es un ORM (Object-Relational Mapping) para Node.js que permite a los desarrolladores
 //interactuar con bases de datos relacionales utilizando un enfoque basado en objetos. En lugar de escribir consultas
  //SQL manualmente, puedes trabajar con modelos y métodos en JavaScript.