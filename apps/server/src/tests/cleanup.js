const testPrisma = require('../prismaTestClient');
const prodPrisma = require('../prisma');
const { clearDatabase } = require('./helpers');

afterAll(async () => {
  await clearDatabase();
  await Promise.allSettled([
    testPrisma.$disconnect(),
    prodPrisma.$disconnect(),
  ]);
});
