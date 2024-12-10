const express = require('express');
const morgan = require('morgan');
const productRoutes = require('./routes/productsRoutes');


const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', productRoutes);

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  console.log(`Microservicio de Productos corriendo en http://localhost:${PORT}`);
});

module.exports = { app, server };



