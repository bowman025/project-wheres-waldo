const request = require('supertest');
const app = require('../app');
const { clearDataBase, createTestImage } = require('./helpers');

beforeEach(async () => {
  await clearDataBase();
});

afterAll(async () => {
  await clearDataBase();
});

describe('GET /api/images', () => {
  it('returns an empty array when no images exist', async () => {
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns images with characters but without coordinates', async () => {
    await createTestImage();
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'Test Image');
    expect(res.body[0].characters).toHaveLength(5);
    res.body[0].characters.forEach((character) => {
      expect(character).not.toHaveProperty('xMin');
      expect(character).not.toHaveProperty('xMax');
      expect(character).not.toHaveProperty('yMin');
      expect(character).not.toHaveProperty('yMax');
    });
  });
});
