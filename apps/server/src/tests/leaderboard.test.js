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
    expect(res.body.scores).toEqual([]);
    expect(res.body.currentPlayer).toBeNull();
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
    expect(res.body.scores).toHaveLength(2);
    expect(res.body.scores[0].playerName).toBe('Fast Player');
    expect(res.body.scores[1].playerName).toBe('Slow Player');
  });

  it('does not include sessions without a player name', async () => {
    const session = await createTestSession(image.id);
    await completeTestSession(session, image.characters);
    const res = await request(app).get(`/api/leaderboard?imageId=${image.id}`);
    expect(res.status).toBe(200);
    expect(res.body.scores).toEqual([]);
  });

  it('returns 400 when imageId is missing', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(400);
  });

  it('returns 400 when imageId is not a number', async () => {
    const res = await request(app).get('/api/leaderboard?imageId=abc');
    expect(res.status).toBe(400);
  });

  it('returns currentPlayer when token is outside top 10', async () => {
    for (let i = 1; i <= 11; i++) {
      const session = await createTestSession(image.id);
      const completed = await completeTestSession(session, image.characters);
      await prisma.gameSession.update({
        where: { id: completed.id },
        data: {
          playerName: `Player ${i}`,
          startedAt: new Date(Date.now() - i * 10000),
          completedAt: new Date(),
        },
      });
    }

    const slowSession = await prisma.gameSession.findFirst({
      where: { playerName: 'Player 11' },
    });

    const res = await request(app).get(
      `/api/leaderboard?imageId=${image.id}&token=${slowSession.token}`
    );

    expect(res.status).toBe(200);
    expect(res.body.scores).toHaveLength(10);
    expect(res.body.currentPlayer).toMatchObject({
      playerName: 'Player 11',
      rank: 11,
    });
  });
});
