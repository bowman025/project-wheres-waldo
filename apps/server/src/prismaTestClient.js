const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.TEST_DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
