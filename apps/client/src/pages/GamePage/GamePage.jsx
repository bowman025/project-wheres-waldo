import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchImages } from '../../utils/api';
import useGameSession from '../../hooks/useGameSession';
import CharacterList from '../../components/CharacterList/CharacterList';
import TargetingBox from '../../components/TargetingBox/TargetingBox';
import PlayerNameModal from '../../components/PlayerNameModal/PlayerNameModal';
import GuessToast from '../../components/GuessToast/GuessToast';
import Timer from '../../components/Timer/Timer';
import styles from './GamePage.module.css';

const GamePage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDismissed, setModalDismissed] = useState(false);

  useEffect(() => {
    fetchImages()
      .then((images) => {
        const found = images.find((img) => img.id === Number(imageId));
        if (!found) throw new Error('Image not found');
        setImage(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [imageId]);

  const {
    token,
    foundCharacters,
    isComplete,
    targetingBox,
    guessResult,
    elapsedSeconds,
    handleImageClick,
    handleGuess,
    handleSubmitName,
    dismissTargetingBox,
  } = useGameSession(imageId, image?.characters);

  const handleSubmit = async (playerName) => {
    await handleSubmitName(playerName);
    setModalDismissed(true);
    navigate(`/leaderboard/${imageId}`, { state: { token } });
  };

  const handleDismiss = () => {
    setModalDismissed(true);
  };

  const handleWrapperClick = (e) => {
    if (targetingBox) {
      dismissTargetingBox();
      return;
    }
    handleImageClick(e);
  };

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <GuessToast guessResult={guessResult} />
      <div className={styles.header}>
        <CharacterList
          characters={image.characters}
          foundCharacters={foundCharacters}
        />
        <Timer seconds={elapsedSeconds} />
      </div>
      <div className={styles.imageWrapper} onClick={handleWrapperClick}>
        <img
          src={image.url}
          alt={image.name}
          className={styles.image}
          draggable={false}
        />
        {targetingBox && (
          <TargetingBox
            targetingBox={targetingBox}
            characters={image.characters}
            foundCharacters={foundCharacters}
            onGuess={handleGuess}
          />
        )}
      </div>
      {isComplete && !modalDismissed && (
        <PlayerNameModal
          time={elapsedSeconds}
          onSubmit={handleSubmit}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};

export default GamePage;
