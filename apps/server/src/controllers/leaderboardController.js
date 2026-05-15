const prisma = require('../prisma');

const LEADERBOARD_LIMIT = 10;

const getLeaderboard = async (req, res) => {
  const { imageId, token } = req.query;

  if (!imageId) {
    return res.status(400).json({ error: 'imageId is required' });
  }

  const parsedImageId = parseInt(imageId, 10);

  if (isNaN(parsedImageId)) {
    return res.status(400).json({ error: 'imageId must be a number' });
  }

  const sessions = await prisma.gameSession.findMany({
    where: {
      imageId: parsedImageId,
      completedAt: { not: null },
      playerName: { not: null },
    },
    select: {
      token: true,
      playerName: true,
      startedAt: true,
      completedAt: true,
    },
  });

  const allScores = sessions
    .map((session) => ({
      token: session.token,
      playerName: session.playerName,
      time: Math.floor(
        (new Date(session.completedAt) - new Date(session.startedAt)) / 1000
      ),
    }))
    .sort((a, b) => a.time - b.time);

  const topScores = allScores.slice(0, LEADERBOARD_LIMIT).map(({ token, ...rest }) => rest);

  let currentPlayer = null;

  if (token) {
    const playerIndex = allScores.findIndex((s) => s.token === token);

    if (playerIndex >= LEADERBOARD_LIMIT) {
      const player = allScores[playerIndex];
      currentPlayer = {
        playerName: player.playerName,
        time: player.time,
        rank: playerIndex + 1,
      };
    }
  }

  res.json({ scores: topScores, currentPlayer });
};

module.exports = { getLeaderboard };
