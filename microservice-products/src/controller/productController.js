const sequelize = require('../db');
const axios = require('axios');

exports.getAllProducts = async (req, res) => {
    try {
        const result = await sequelize.query('SELECT * FROM products');
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

exports.getProductsByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const productsResult = await sequelize.query('SELECT * FROM products WHERE usuarioId = $1', {
            bind: [id],
        });
        
        if (productsResult[0].length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos para este usuario' });
        }

        const userResponse = await axios.get(`http://localhost:3001/api/users/${id}`);
        const user = userResponse.data;

        return res.status(200).json({ user, product: productsResult[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sequelize.query('SELECT * FROM products WHERE product_id = $1', {
            bind: [id],
        });

        if (result[0].length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json(result[0][0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

exports.saveProduct = async (req, res) => {
    const { product_name, price, usuarioId } = req.body;

    if (!product_name || !price || !usuarioId) {
        return res.status(400).json({ error: 'El nombre, el precio y el usuarioId son requeridos' });
    }

    try {
        const existingProduct = await sequelize.query('SELECT * FROM products WHERE product_name = $1', {
            bind: [product_name],
        });

        if (existingProduct[0].length > 0) {
            return res.status(409).json({ error: 'El producto ya existe' });
        }

        const result = await sequelize.query(
            'INSERT INTO products (product_name, price, usuarioId) VALUES ($1, $2, $3) RETURNING *',
            {
                bind: [product_name, price, usuarioId],
            }
        );

        return res.status(201).json(result[0][0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product_name, price } = req.body;

    if (!product_name || !price) {
        return res.status(400).json({ error: 'El nombre y el precio son obligatorios' });
    }

    try {
        const result = await sequelize.query(
            'UPDATE products SET product_name = $1, price = $2 WHERE product_id = $3 RETURNING *',
            {
                bind: [product_name, price, id],
            }
        );

        if (result[0].length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({ message: 'Producto actualizado', product: result[0][0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sequelize.query('DELETE FROM products WHERE product_id = $1 RETURNING *', {
            bind: [id],
        });

        if (result[0].length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
