const { randomUUID } = require('node:crypto');
const prisma = require('../prisma');

const startSession = async (req, res) => {
  const { imageId } = req.body;

  if (!imageId) {
    return res.status(400).json({ error: 'imageId is required.' });
  }

  const image = await prisma.image.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return res.status(404).json({ error: 'Image not found.' });
  }

  const session = await prisma.gameSession.create({
    data: {
      imageId,
      token: randomUUID(),
    },
  });

  res.status(201).json({ token: session.token });
};

const validateGuess = async (req, res) => {
  const { token } = req.params;
  const { characterId, x, y } = req.body;

  if (!characterId || x === undefined || y === undefined) {
    return res.status(400).json({ error: 'characterId, x and y are required.' });
  }

  const session = await prisma.gameSession.findUnique({
    where: { token },
  });

  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  if (session.completedAt) {
    return res.status(400).json({ error: 'Session already completed.' });
  }

  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      imageId: session.imageId,
    },
  });

  if (!character) {
    return res.status(404).json({ error: 'Character not found.' });
  }

  const alreadyFound = await prisma.find.findFirst({
    where: {
      sessionId: session.id,
      characterId,
    },
  });

  if (alreadyFound) {
    return res.status(400).json({ error: 'Character already found.' });
  }

  const isCorrect =
    x >= character.xMin &&
    x <= character.xMax &&
    y >= character.yMin &&
    y <= character.yMax;

  if (!isCorrect) {
    return res.json({ correct: false, complete: false });
  }

  await prisma.find.create({
    data: {
      sessionId: session.id,
      characterId,
    },
  });

  const totalCharacters = await prisma.character.count({
    where: { imageId: session.imageId },
  });

  const totalFound = await prisma.find.count({
    where: { sessionId: session.id },
  });

  const complete = totalFound === totalCharacters;

  if (complete) {
    await prisma.gameSession.update({
      where: { token },
      data: { completedAt: new Date() },
    });
  }

  return res.json({ correct: true, complete });
};

const completeSession = async (req, res) => {
  const { token } = req.params;
  const { playerName } = req.body;

  if (!playerName || typeof playerName !== 'string' || !playerName.trim()) {
    return res.status(400).json({ error: 'playerName is required.' });
  }

  const session = await prisma.gameSession.findUnique({
    where: { token },
  });

  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  if (!session.completedAt) {
    return res.status(400).json({ error: 'Session is not completed yet.' });
  }

  if (session.playerName) {
    return res.status(400).json({ error: 'Score already submitted.' });
  }

  const updated = await prisma.gameSession.update({
    where: { token },
    data: { playerName: playerName.trim() },
  });

  const elapsed = updated.completedAt - updated.startedAt;
  const seconds = Math.floor(elapsed / 1000);

  res.json({ playerName: updated.playerName, time: seconds });
};

module.exports = { startSession, validateGuess, completeSession };
