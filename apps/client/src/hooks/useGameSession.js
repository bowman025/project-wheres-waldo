import { useState, useEffect, useCallback } from 'react';
import { startSession, validateGuess, completeSession } from '../utils/api';

const useGameSession = (imageId, characters) => {
  const [token, setToken] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState(null);
  const [targetingBox, setTargetingBox] = useState(null);
  const [guessResult, setGuessResult] = useState(null);

  useEffect(() => {
    if (!imageId) return;
    startSession(Number(imageId))
      .then((data) => setToken(data.token))
      .catch((err) => setError(err.message));
  }, [imageId]);

  useEffect(() => {
    if (!token || isComplete) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [token, isComplete]);

  const handleImageClick = useCallback(
    (e) => {
      if (isComplete) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setTargetingBox({
        x,
        y,
        pixelX: e.clientX - rect.left,
        pixelY: e.clientY - rect.top,
      });
    },
    [isComplete]
  );

  const handleGuess = useCallback(
    async (characterId) => {
      if (!token || !targetingBox) return;

      setTargetingBox(null);

      try {
        const result = await validateGuess(
          token,
          characterId,
          targetingBox.x,
          targetingBox.y
        );

        if (result.correct) {
          setFoundCharacters((prev) => [...prev, characterId]);
        }

        if (result.complete) {
          setIsComplete(true);
        }

        const character = characters.find((c) => c.id === characterId);
        setGuessResult({
          correct: result.correct,
          characterName: character?.name,
        });

        setTimeout(() => setGuessResult(null), 2000);
      } catch (err) {
        setError(err.message);
      }
    },
    [token, targetingBox, characters]
  );

  const handleSubmitName = useCallback(
    async (playerName) => {
      if (!token) return;
      try {
        const result = await completeSession(token, playerName);
        setElapsedTime(result.time);
        return result;
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const dismissTargetingBox = useCallback(() => {
    setTargetingBox(null);
  }, []);

  return {
    token,
    foundCharacters,
    isComplete,
    elapsedTime,
    elapsedSeconds,
    error,
    targetingBox,
    guessResult,
    handleImageClick,
    handleGuess,
    handleSubmitName,
    dismissTargetingBox,
  };
};

export default useGameSession;
