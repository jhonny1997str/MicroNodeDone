const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes'); // Ajuste aquí

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Cambia la ruta base de la API para los usuarios
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Microservicio de Usuarios corriendo en http://localhost:${PORT}`);
});

module.exports = { app, server };



