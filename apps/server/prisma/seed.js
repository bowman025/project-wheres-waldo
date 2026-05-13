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

  const images = [
    {
      name: 'French Riviera',
      url: 'https://res.cloudinary.com/dszl8mguy/image/upload/q_auto/f_auto/v1778670312/french-riviera_olhl6o.png',
      characters: [
        {
          name: 'Claire Moreau',
          xMin: 0.24,
          xMax: 0.3,
          yMin: 0.3,
          yMax: 0.39,
        },
        {
          name: 'Marcel Lefebvre',
          xMin: 0.63,
          xMax: 0.72,
          yMin: 0.61,
          yMax: 0.75,
        },
        {
          name: 'Lucas Garnier',
          xMin: 0.11,
          xMax: 0.18,
          yMin: 0.52,
          yMax: 0.64,
        },
      ],
    },
    {
      name: 'English Village',
      url: 'https://res.cloudinary.com/dszl8mguy/image/upload/q_auto/f_auto/v1778674818/english-village_ya4zew.png',
      characters: [
        {
          name: 'Thomas Greenway',
          xMin: 0.14,
          xMax: 0.2,
          yMin: 0.52,
          yMax: 0.59,
        },
        {
          name: 'Eleanor Whitcombe',
          xMin: 0.3,
          xMax: 0.33,
          yMin: 0.14,
          yMax: 0.2,
        },
        {
          name: 'Arthur Pemberton',
          xMin: 0.32,
          xMax: 0.38,
          yMin: 0.6,
          yMax: 0.69,
        },
        {
          name: 'Julian Hawthorne',
          xMin: 0.46,
          xMax: 0.54,
          yMin: 0.83,
          yMax: 0.93,
        },
      ],
    },
    {
      name: 'Wild West',
      url: 'https://res.cloudinary.com/dszl8mguy/image/upload/q_auto/f_auto/v1778525268/wild-west_rqbh6g.png',
      characters: [
        {
          name: 'Red Mesa Rico',
          xMin: 0.09,
          xMax: 0.15,
          yMin: 0.16,
          yMax: 0.25,
        },
        {
          name: 'Sunny Belle Carter',
          xMin: 0.41,
          xMax: 0.47,
          yMin: 0.36,
          yMax: 0.46,
        },
        {
          name: 'Black Jack Mercer',
          xMin: 0.4,
          xMax: 0.49,
          yMin: 0.47,
          yMax: 0.61,
        },
        {
          name: 'Sheriff Clay Boone',
          xMin: 0.69,
          xMax: 0.8,
          yMin: 0.64,
          yMax: 0.82,
        },
        {
          name: 'Lucky Vance Delgado',
          xMin: 0.65,
          xMax: 0.73,
          yMin: 0.46,
          yMax: 0.53,
        },
      ],
    },
    {
      name: 'Cyber City',
      url: 'https://res.cloudinary.com/dszl8mguy/image/upload/q_auto/f_webp,fl_awebp/v1777896257/cyberpunk-main_iz3ain.png',
      characters: [
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
  ];

  for (const imageData of images) {
    const image = await prisma.image.create({
      data: {
        name: imageData.name,
        url: imageData.url,
        characters: {
          create: imageData.characters,
        },
      },
    });
    console.log(
      `Created image: ${image.name} with ${imageData.characters.length} characters`
    );
  }

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
