const request = require('supertest');
const { app, server } = require('../app');
const sequelize = require('../db');

let userId;

afterAll(async () => {
  server.close();
  await sequelize.close();
});

describe('User API', () => {
  beforeEach(async () => {
    await sequelize.query('DELETE FROM users');
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'John Doe', phone: '12345' });
    userId = res.body.user_id;
  });

  afterEach(async () => {
    if (userId) {
      await sequelize.query('DELETE FROM users WHERE user_id = $1', {
        bind: [userId],
      });
      userId = null;
    }
  });

  it('debería crear un usuario', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'Jane Doe', phone: '45678' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user_name', 'Jane Doe');
    expect(res.body).toHaveProperty('phone', '45678');
    expect(res.body).toHaveProperty('user_id');
  });

  it('debería obtener todos los usuarios', async () => {
    const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const user = res.body.find((u) => u.user_id === userId);
    expect(user).toBeDefined();
    expect(user.user_name).toBe('John Doe');
  });

  it('debería obtener un usuario por ID', async () => {
    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user_id', userId);
    expect(res.body).toHaveProperty('user_name', 'John Doe');
  });

  it('debería actualizar un usuario', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ user_name: 'John Updated', phone: '99999' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Usuario actualizado');
    expect(res.body.user.user_name).toBe('John Updated');
  });

  it('debería eliminar un usuario', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Usuario eliminado');

    const checkRes = await request(app).get(`/api/users/${userId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
