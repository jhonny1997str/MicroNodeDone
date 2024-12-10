const express = require('express');
const {
  getAllProducts,
  getProductsByUserId, 
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/productController');

const router = express.Router();

// Defino los métodos
router.get('/products', getAllProducts);
router.get('/products-users/:id', getProductsByUserId); 
router.get('/products/:id', getProductById);
router.post('/products', saveProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Exporto el módulo  
module.exports = router;
