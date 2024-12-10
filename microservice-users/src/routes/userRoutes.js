const express = require('express');
const {
  getAllUsers,
  getUserById,
  saveUser,
  updateUser, 
  deleteUser,
} = require('../controller/userController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', saveUser);
router.put('/users/:id', updateUser); 
router.delete('/users/:id', deleteUser);

module.exports = router;

