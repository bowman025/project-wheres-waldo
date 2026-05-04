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
            xMin: 0.1,
            xMax: 0.15,
            yMin: 0.2,
            yMax: 0.27,
          },
          {
            name: 'Lira Vex',
            xMin: 0.45,
            xMax: 0.5,
            yMin: 0.6,
            yMax: 0.67,
          },
          {
            name: 'Wallyx',
            xMin: 0.7,
            xMax: 0.75,
            yMin: 0.1,
            yMax: 0.17,
          },
          {
            name: 'Nova Faye',
            xMin: 0.3,
            xMax: 0.35,
            yMin: 0.8,
            yMax: 0.87,
          },
          {
            name: 'Zero-7',
            xMin: 0.85,
            xMax: 0.9,
            yMin: 0.45,
            yMax: 0.52,
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
