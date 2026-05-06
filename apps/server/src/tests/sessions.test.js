const request = require('supertest');
const app = require('../app');
const {
  clearDatabase,
  createTestImage,
  createTestSession,
  completeTestSession,
} = require('./helpers');

let image;

beforeEach(async () => {
  await clearDatabase();
  image = await createTestImage();
});

afterAll(async () => {
  await clearDatabase();
});

describe('POST /api/sessions', () => {
  it('creates a session and returns a token', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ imageId: image.id });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 400 when imageId is missing', async () => {
    const res = await request(app).post('/api/sessions').send({});
    expect(res.status).toBe(400);
  });

  it('returns 404 when image does not exist', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ imageId: 99999 });
    expect(res.status).toBe(404);
  });
});

describe('POST /api/sessions/:token/validate', () => {
  let session;
  let character;

  beforeEach(async () => {
    session = await createTestSession(image.id);
    character = image.characters[0];
  });

  it('returns correct: true for a valid guess', async () => {
    const res = await request(app)
      .post(`/api/sessions/${session.token}/validate`)
      .send({ characterId: character.id, x: 0.12, y: 0.23 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ correct: true, complete: false });
  });

  it('returns correct: false for a wrong guess', async () => {
    const res = await request(app)
      .post(`/api/sessions/${session.token}/validate`)
      .send({ characterId: character.id, x: 0.99, y: 0.99 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ correct: false, complete: false });
  });

  it('returns complete: true when all characters are found', async () => {
    for (const char of image.characters.slice(0, -1)) {
      await request(app)
        .post(`/api/sessions/${session.token}/validate`)
        .send({ characterId: char.id, x: char.xMin + 0.01, y: char.yMin + 0.01 });
    }
    const lastChar = image.characters[image.characters.length - 1];
    const res = await request(app)
      .post(`/api/sessions/${session.token}/validate`)
      .send({ characterId: lastChar.id, x: lastChar.xMin + 0.01, y: lastChar.yMin + 0.01 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ correct: true, complete: true });
  });

  it('returns 400 when character is already found', async () => {
    await request(app)
      .post(`/api/sessions/${session.token}/validate`)
      .send({ characterId: character.id, x: 0.12, y: 0.23 });
    const res = await request(app)
      .post(`/api/sessions/${session.token}/validate`)
      .send({ characterId: character.id, x: 0.12, y: 0.23 });
    expect(res.status).toBe(400);
  });

  it('returns 404 for an invalid token', async () => {
    const res = await request(app)
      .post('/api/sessions/invalid-token/validate')
      .send({ characterId: character.id, x: 0.12, y: 0.23 });
    expect(res.status).toBe(404);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post(`/api/sessions/${session.token}/validate`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('POST /api/sessions/:token/complete', () => {
  let session;

  beforeEach(async () => {
    session = await createTestSession(image.id);
  });

  it('records player name and returns time for a completed session', async () => {
    const completed = await completeTestSession(session, image.characters);
    const res = await request(app)
      .post(`/api/sessions/${completed.token}/complete`)
      .send({ playerName: 'Tester' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('playerName', 'Tester');
    expect(res.body).toHaveProperty('time');
    expect(typeof res.body.time).toBe('number');
  });

  it('returns 400 when session is not yet completed', async () => {
    const res = await request(app)
      .post(`/api/sessions/${session.token}/complete`)
      .send({ playerName: 'Tester' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when playerName is missing', async () => {
    const completed = await completeTestSession(session, image.characters);
    const res = await request(app)
      .post(`/api/sessions/${completed.token}/complete`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 when score is already submitted', async () => {
    const completed = await completeTestSession(session, image.characters);
    await request(app)
      .post(`/api/sessions/${completed.token}/complete`)
      .send({ playerName: 'Tester' });
    const res = await request(app)
      .post(`/api/sessions/${completed.token}/complete`)
      .send({ playerName: 'Tester' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for an invalid token', async () => {
    const res = await request(app)
      .post('/api/sessions/invalid-token/complete')
      .send({ playerName: 'Tester' });
    expect(res.status).toBe(404);
  });
});
