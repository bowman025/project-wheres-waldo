const prisma = require('../prisma');

const LEADERBOARD_LIMIT = 10;

const getLeaderBoard = async (req, res) => {
  const { imageId } = req.query;

  if (!imageId) {
    return res.status(400).json({ error: 'imageId is required.' });
  }

  const parsedImageId = parseInt(imageId, 10);

  if (isNaN(parsedImageId)) {
    return res.status(400).json({ error: 'imageId must be a number.' });
  }

  const sessions = await prisma.gameSession.findMany({
    where: {
      imageId: parsedImageId,
      completedAt: { not: null },
      playerName: { not: null },
    },
    select: {
      playerName: true,
      startedAt: true,
      completedAt: true,
    },
  });

  const scores = sessions
    .map((session) => ({
      playerName: session.playerName,
      time: Math.floor((session.completedAt - session.startedAt) / 1000),
    }))
    .sort((a, b) => a.tim - b.time)
    .slice(0, LEADERBOARD_LIMIT);

  res.json(scores);
}

module.exports = { getLeaderBoard };