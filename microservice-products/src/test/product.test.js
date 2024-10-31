const request = require('supertest');
const { app, server } = require('../app');
const sequelize = require('../db');

let productId;

afterAll(async () => {
  server.close();
  await sequelize.close();
});

describe('Product API', () => {
  beforeEach(async () => {
    await sequelize.query('DELETE FROM products'); // Limpia la tabla
    const res = await request(app)
      .post('/api/products')
      .send({ product_name: 'John Doe', price: '12345' });
    productId = res.body.product_id; // Guarda el ID del producto creado
  });

  afterEach(async () => {
    if (productId) {
      await sequelize.query('DELETE FROM products WHERE product_id = $1', {
        bind: [productId],
      });
      productId = null;
    }
  });

  it('debería crear un producto', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ product_name: 'Jane Doe', price: '45678' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('product_name', 'Jane Doe');
    expect(res.body).toHaveProperty('price', '45678');
    expect(res.body).toHaveProperty('product_id');
  });

  it('debería obtener todos los productos', async () => {
    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const product = res.body.find((p) => p.product_id === productId);
    expect(product).toBeDefined();
    expect(product.product_name).toBe('John Doe');
  });

  it('debería obtener un producto por ID', async () => {
    const res = await request(app).get(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('product_id', productId);
    expect(res.body).toHaveProperty('product_name', 'John Doe');
  });

  it('debería actualizar un producto', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ product_name: 'John Updated', price: '99999' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Producto actualizado');
    expect(res.body.product.product_name).toBe('John Updated');
  });

  it('debería eliminar un producto', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Producto eliminado');

    const checkRes = await request(app).get(`/api/products/${productId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});



