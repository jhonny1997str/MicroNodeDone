const express = require('express');
const morgan = require('morgan');
const productRoutes = require('./routes/productsRoutes');

// Crea una instancia de Express
const app = express();

// Uso de morgan para registrar las peticiones HTTP
app.use(morgan('dev'));
app.use(express.json());

// Define la ruta base de la API
app.use('/api', productRoutes);

// Define el puerto
const PORT = process.env.PORT || 3002;

// Inicio del servidor
const server = app.listen(PORT, () => {
  console.log(`Microservicio de Productos corriendo en http://localhost:${PORT}`);
});

// Exporta módulos para ser usados en otras partes
module.exports = { app, server };



