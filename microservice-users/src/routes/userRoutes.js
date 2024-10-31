const express = require('express');
const {
  getAllUsers,
  getUserById,
  saveUser,
  updateUser, // Ajuste aquí
  deleteUser,
} = require('../controller/userController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', saveUser);
router.put('/users/:id', updateUser); // Ajuste aquí
router.delete('/users/:id', deleteUser);

module.exports = router;

//ROUTER Un router es un objeto en Express que permite definir y gestionar las rutas de una aplicación.
// Esencialmente, actúa como un módulo que encapsula un conjunto de rutas y su lógica asociada.

