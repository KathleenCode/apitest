import request from "supertest"
import app from "app.js"

describe('POST /auth/register', () => {
  it('should register user successfully with default organisation', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data.user).toMatchObject({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    });
  });

  it('should log user in successfully', async () => {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data.user).toMatchObject({
      email: loginData.email,
    });
  });

  // Add more test cases for validation errors, duplicate email/userID, etc.
});
