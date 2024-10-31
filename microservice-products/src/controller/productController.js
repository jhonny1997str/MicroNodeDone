// Importar la conexión a la base de datos
const sequelize = require('../db');
// Importar la librería axios para realizar solicitudes HTTP
const axios = require('axios');

// Función para obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        // Realiza una consulta a la base de datos para obtener todos los productos
        const result = await sequelize.query('SELECT * FROM products');
        // Devuelve una respuesta con los productos en formato JSON y un código de estado 200
        return res.status(200).json(result[0]); // Cambia result.rows a result[0]
    } catch (error) {
        // Si ocurre un error, lo registra en la consola
        console.error(error);
        // Devuelve un código de estado 500 con un mensaje de error
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Función para obtener productos por ID de usuario y la información del usuario relacionado
exports.getProductsByUserId = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del usuario desde los parámetros de la solicitud

    try {
        // Consulta para obtener los productos de la base de datos para este usuario
        const productsResult = await sequelize.query('SELECT * FROM products WHERE usuarioId = $1', {
            bind: [id], // Asocia el ID del usuario a la consulta
        });
        
        // Verifica si no se encontraron productos
        if (productsResult[0].length === 0) {
            // Devuelve un código de estado 404 con un mensaje de error
            return res.status(404).json({ error: 'No se encontraron productos para este usuario' });
        }

        // Realiza una llamada al microservicio de usuarios utilizando el ID del usuario
        const userResponse = await axios.get(`http://localhost:3001/api/users/${id}`);
        // Almacena los datos del usuario que se encontraron en el microservicio
        const user = userResponse.data;

        // Devuelve los productos junto con la información del usuario en formato JSON
        return res.status(200).json({ user, product: productsResult[0] });
    } catch (err) {
        // Si ocurre un error, lo registra en la consola
        console.error(err);
        // Devuelve un código de estado 500 con un mensaje de error
        return res.status(500).json({ error: err.message });
    }
};

// Función para obtener un producto por ID
exports.getProductById = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del producto desde los parámetros de la solicitud

    try {
        // Consulta para obtener el producto de la base de datos utilizando el ID
        const result = await sequelize.query('SELECT * FROM products WHERE product_id = $1', {
            bind: [id], // Asocia el ID del producto a la consulta
        });

        // Verifica si no se encontró el producto
        if (result[0].length === 0) {
            // Devuelve un código de estado 404 con un mensaje de error
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Devuelve el primer producto en formato JSON con un código de estado 200
        return res.status(200).json(result[0][0]); // Devuelve el primer producto
    } catch (error) {
        // Si ocurre un error, lo registra en la consola
        console.error(error);
        // Devuelve un código de estado 500 con un mensaje de error
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Función para guardar un nuevo producto
exports.saveProduct = async (req, res) => {
    const { product_name, price, usuarioId } = req.body; // Obtiene los datos del nuevo producto del cuerpo de la solicitud

    // Validación de entrada
    if (!product_name || !price || !usuarioId) {
        // Devuelve un código de estado 400 si faltan datos requeridos
        return res.status(400).json({ error: 'El nombre, el precio y el usuarioId son requeridos' });
    }

    try {
        // Consulta para verificar si el producto ya existe
        const existingProduct = await sequelize.query('SELECT * FROM products WHERE product_name = $1', {
            bind: [product_name], // Asocia el nombre del producto a la consulta
        });

        // Verifica si el producto ya existe
        if (existingProduct[0].length > 0) {
            // Devuelve un código de estado 409 si el producto ya existe
            return res.status(409).json({ error: 'El producto ya existe' });
        }

        // Consulta SQL para insertar el nuevo producto en la base de datos
        const result = await sequelize.query(
            'INSERT INTO products (product_name, price, usuarioId) VALUES ($1, $2, $3) RETURNING *',
            {
                bind: [product_name, price, usuarioId], // Asocia los datos del nuevo producto a la consulta
            }
        );

        // Devuelve el nuevo producto creado en formato JSON con un código de estado 201
        return res.status(201).json(result[0][0]);
    } catch (error) {
        // Si ocurre un error, lo registra en la consola
        console.error(error);
        // Devuelve un código de estado 500 con un mensaje de error
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// Función para actualizar un producto existente
exports.updateProduct = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del producto desde los parámetros de la solicitud
    const { product_name, price } = req.body; // Obtiene los nuevos datos del producto del cuerpo de la solicitud

    // Validación de datos de entrada
    if (!product_name || !price) {
        // Devuelve un código de estado 400 si faltan datos requeridos
        return res.status(400).json({ error: 'El nombre y el precio son obligatorios' });
    }

    try {
        // Consulta SQL para actualizar el producto en la base de datos
        const result = await sequelize.query(
            'UPDATE products SET product_name = $1, price = $2 WHERE product_id = $3 RETURNING *',
            {
                bind: [product_name, price, id], // Asocia los nuevos datos y el ID del producto a la consulta
            }
        );

        // Verifica si no se encontró el producto para actualizar
        if (result[0].length === 0) {
            // Devuelve un código de estado 404 con un mensaje de error
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Devuelve un mensaje de éxito y el producto actualizado en formato JSON
        return res.status(200).json({ message: 'Producto actualizado', product: result[0][0] });
    } catch (error) {
        // Si ocurre un error, lo registra en la consola
        console.error(error);
        // Devuelve un código de estado 500 con un mensaje de error
        return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Función para eliminar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del producto desde los parámetros de la solicitud

    try {
        // Consulta SQL para eliminar el producto de la base de datos
        const result = await sequelize.query('DELETE FROM products WHERE product_id = $1 RETURNING *', {
            bind: [id], // Asocia el ID del producto a la consulta
        });

        // Verifica si no se encontró el producto para eliminar
        if (result[0].length === 0) {
            // Devuelve un código de estado 404 con un mensaje de error
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Devuelve un mensaje de éxito indicando que el producto fue eliminado
        return res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        // Si ocurre un error, lo registra en la consola
        console.error(error);
        // Devuelve un código de estado 500 con un mensaje de error
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

//AXIOS : Axios es una biblioteca de JavaScript utilizada para realizar solicitudes HTTP desde el navegador o 
//desde un entorno de Node.js Axios se utiliza comúnmente para enviar y recibir datos de APIs RESTful. Permite 
//realizar operaciones como GET, POST, PUT y DELETE.

//BIND bind se refiere a una forma de pasar parámetros a una consulta SQL de manera segura y evitar la inyección 
//de SQL
//La inyección SQL es una técnica de ataque que puede comprometer la seguridad de tu base de datos. Al usar
// parámetros vinculados y no concatenados, validar la entrada del usuario y utilizar un ORM, puedes proteger tu aplicación contra este tipo de vulnerabilidades.
