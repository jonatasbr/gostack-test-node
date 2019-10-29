import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import truncate from '../util/truncate';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await User.create({
      name: 'Jonatas Braz',
      email: 'jonatasbraz@gmail.com',
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Jonatas Braz',
        email: 'jonatasbraz@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicate email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Jonatas Braz',
        email: 'jonatasbraz@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Jonatas Braz',
        email: 'jonatasbraz@gmail.com',
        password: '123456',
      });
    expect(response.status).toBe(400);
  });
});
