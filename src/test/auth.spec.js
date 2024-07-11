import request from "supertest"
import app from "../index.js"

describe('POST /auth/register', () => {
  it('should register user successfully with default organisation', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: "0000000000"
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
      password: userData.password,
      phone: userData.phone
    });
  });
  // Add more test cases for validation errors, duplicate email/userID, etc.
});


describe('POST /auth/login', () => {
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
  });  // Add more test cases for validation errors, duplicate email/userID, etc.
});


describe('GET /api/organisations', () => {
  it('should get organisations', async () => {
    const organisation = {
      orgId: "7",
      name: "Zoe's Organisation",
      description: "hjgjjhjh"
    };

    const response = await request(app)
      .post('/api/organisations')
      .send(organisation)
      .expect(201);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data.user).toMatchObject({
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description
    });
  });

  // Add more test cases for validation errors, duplicate email/userID, etc.
});


describe('POST /api/organisation', () => {
  it('should successfully create organisation', async () => {
    const organisation = {
      orgId: "7",
      name: "Zoe's Organisation",
      description: "hjgjjhjh"
    };

    const response = await request(app)
      .post('/api/organisation')
      .send(organisation)
      .expect(201);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data.user).toMatchObject({
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description
    });
  });

  // Add more test cases for validation errors, duplicate email/userID, etc.
});


describe('GET /api/users/:id', () => {
  it('should get user details successfully', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: "0000000"
    };

    const response = await request(app)
      .post('/api/users/:id')
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

  // Add more test cases for validation errors, duplicate email/userID, etc.
});

describe('GET /api/organisations/:orgId', () => {
  it('should get an organisation successfully', async () => {
    const organisation = {
      orgId: "7",
      name: "Zoe's Organisation",
      description: "hjgjjhjh"
    };

    const response = await request(app)
      .post('/api/organisations/:orgId')
      .send(organisation)
      .expect(201);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data.user).toMatchObject({
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description
    });
  });

  // Add more test cases for validation errors, duplicate email/userID, etc.
});


describe('POST /api/organisations/:orgId/users', () => {
  it('should add user successfully to  organisation', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/organisations/:orgId/users')
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

  // Add more test cases for validation errors, duplicate email/userID, etc.
});