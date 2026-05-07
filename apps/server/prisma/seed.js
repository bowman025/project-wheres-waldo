'use strict';

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { config } = require('dotenv');
const { resolve } = require('node:path');

config({ path: resolve(__dirname, '../../../.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  await prisma.$transaction([
    prisma.find.deleteMany(),
    prisma.gameSession.deleteMany(),
    prisma.character.deleteMany(),
    prisma.image.deleteMany(),
  ]);

  const image = await prisma.image.create({
    data: {
      name: 'Cyber City',
      url: 'https://res.cloudinary.com/dszl8mguy/image/upload/q_auto/f_webp,fl_awebp/v1777896257/cyberpunk-main_iz3ain.png',
      characters: {
        create: [
          {
            name: 'Rex Merrick',
            xMin: 0.28,
            xMax: 0.33,
            yMin: 0.11,
            yMax: 0.17,
          },
          {
            name: 'Lira Vex',
            xMin: 0.71,
            xMax: 0.76,
            yMin: 0.09,
            yMax: 0.17,
          },
          {
            name: 'Wallyx',
            xMin: 0.53,
            xMax: 0.56,
            yMin: 0.26,
            yMax: 0.33,
          },
          {
            name: 'Nova Faye',
            xMin: 0.62,
            xMax: 0.66,
            yMin: 0.27,
            yMax: 0.35,
          },
          {
            name: 'Zero-7',
            xMin: 0.89,
            xMax: 0.94,
            yMin: 0.58,
            yMax: 0.66,
          },
        ],
      },
    },
  });

  console.log(`Create image: ${image.name} with 5 characters.`);
  console.log('Seeding complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
