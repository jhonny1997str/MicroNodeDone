const sequelize = require('../db');

// Obtiene todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const result = await sequelize.query('SELECT * FROM users');
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtiene un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sequelize.query('SELECT * FROM users WHERE user_id = $1', {
      bind: [id],
    });

    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(result[0][0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Guarda un nuevo usuario
exports.saveUser = async (req, res) => {
  const { user_name, phone } = req.body;

  if (!user_name || !phone) {
    return res.status(400).json({ error: 'El nombre y el teléfono son requeridos' });
  }

  try {
    const existingUser = await sequelize.query('SELECT * FROM users WHERE user_name = $1', {
      bind: [user_name],
    });

    if (existingUser[0].length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const result = await sequelize.query(
      'INSERT INTO users (user_name, phone) VALUES ($1, $2) RETURNING *',
      {
        bind: [user_name, phone],
      }
    );

    return res.status(201).json(result[0][0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Actualiza un usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { user_name, phone } = req.body;

  if (!user_name || !phone) {
    return res.status(400).json({ error: 'El nombre y el teléfono son obligatorios' });
  }

  try {
    const result = await sequelize.query(
      'UPDATE users SET user_name = $1, phone = $2 WHERE user_id = $3 RETURNING *',
      {
        bind: [user_name, phone, id],
      }
    );

    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario actualizado', user: result[0][0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Elimina un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sequelize.query('DELETE FROM users WHERE user_id = $1 RETURNING *', {
      bind: [id],
    });

    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
