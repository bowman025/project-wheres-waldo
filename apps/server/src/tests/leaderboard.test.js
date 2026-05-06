const request = require('supertest');
const app = require('../app');
const {
  clearDatabase,
  createTestImage,
  createTestSession,
  completeTestSession,
  prisma,
} = require('./helpers');

let image;

beforeEach(async () => {
  await clearDatabase();
  image = await createTestImage();
});

describe('GET /api/leaderboard', () => {
  it('returns an empty array when no completed sessions exist', async () => {
    const res = await request(app).get(`/api/leaderboard?imageId=${image.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns scores ordered by fastest time', async () => {
    const sessionA = await createTestSession(image.id);
    const completedA = await completeTestSession(sessionA, image.characters);
    await prisma.gameSession.update({
      where: { id: completedA.id },
      data: {
        playerName: 'Slow Player',
        startedAt: new Date(Date.now() - 120000),
        completedAt: new Date(Date.now() - 60000),
      },
    });

    const sessionB = await createTestSession(image.id);
    const completedB = await completeTestSession(sessionB, image.characters);
    await prisma.gameSession.update({
      where: { id: completedB.id },
      data: {
        playerName: 'Fast Player',
        startedAt: new Date(Date.now() - 40000),
        completedAt: new Date(Date.now() - 10000),
      },
    });

    const res = await request(app).get(`/api/leaderboard?imageId=${image.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].playerName).toBe('Fast Player');
    expect(res.body[1].playerName).toBe('Slow Player');
  });

  it('does not include sessions without a player name', async () => {
    const session = await createTestSession(image.id);
    await completeTestSession(session, image.characters);
    const res = await request(app).get(`/api/leaderboard?imageId=${image.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 400 when imageId is missing', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(400);
  });

  it('returns 400 when imageId is not a number', async () => {
    const res = await request(app).get('/api/leaderboard?imageId=abc');
    expect(res.status).toBe(400);
  });
});
