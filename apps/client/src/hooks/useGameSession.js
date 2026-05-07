import { useState, useEffect, useCallback } from 'react';
import { startSession, validateGuess, completeSession } from '../utils/api';

const useGameSession = (imageId, characters) => {
  const [token, setToken] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [error, setError] = useState(null);
  const [targetingBox, setTargetingBox] = useState(null);

  useEffect(() => {
    if (!imageId) return;
    startSession(Number(imageId))
      .then((data) => setToken(data.token))
      .catch((err) => setError(err.message));
  }, [imageId]);

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
      } catch (err) {
        setError(err.message);
      }
    },
    [token, targetingBox]
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
    error,
    targetingBox,
    handleImageClick,
    handleGuess,
    handleSubmitName,
    dismissTargetingBox,
  };
};

export default useGameSession;
