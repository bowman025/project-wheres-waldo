const prisma = require('../prismaTestClient');

const clearDatabase = async () => {
  await prisma.find.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.character.deleteMany();
  await prisma.image.deleteMany();
};

const createTestImage = async () => {
  return prisma.image.create({
    data: {
      name: 'Test Image',
      url: 'https://example.com/test.jpg',
      characters: {
        create: [
          { name: 'Character One', xMin: 0.10, xMax: 0.15, yMin: 0.20, yMax: 0.27 },
          { name: 'Character Two', xMin: 0.45, xMax: 0.50, yMin: 0.60, yMax: 0.67 },
          { name: 'Character Three', xMin: 0.70, xMax: 0.75, yMin: 0.10, yMax: 0.17 },
          { name: 'Character Four', xMin: 0.30, xMax: 0.35, yMin: 0.80, yMax: 0.87 },
          { name: 'Character Five', xMin: 0.85, xMax: 0.90, yMin: 0.45, yMax: 0.52 },
        ],
      },
    },
    include: { characters: true },
  });
};

const createTestSession = async (imageId) => {
  const { randomUUID } = require('node:crypto');
  return prisma.gameSession.create({
    data: {
      imageId,
      token: randomUUID(),
    },
  });
};

const completeTestSession = async (session, characters) => {
  for (const character of characters) {
    await prisma.find.create({
      data: {
        sessionId: session.id,
        characterId: character.id,
      },
    });
  }
  return prisma.gameSession.update({
    where: { id: session.id },
    data: { completedAt: new Date() },
  });
};

module.exports = {
  prisma,
  clearDatabase,
  createTestImage,
  createTestSession,
  completeTestSession,
};
