const prisma = require('../prisma');

const getImages = async (req, res) => {
  const images = await prisma.image.findMany({
    include: {
      characters: {
        select: {
          id: true,
          name: true,
          portraitUrl: true,
        },
      },
    },
  });

  res.json(images);
};

module.exports = { getImages };
