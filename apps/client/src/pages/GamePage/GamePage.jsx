import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchImages } from '../../utils/api';
import useGameSession from '../../hooks/useGameSession';
import CharacterList from '../../components/CharacterList/CharacterList';
import TargetingBox from '../../components/TargetingBox/TargetingBox';
import PlayerNameModal from '../../components/PlayerNameModal/PlayerNameModal';
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
    foundCharacters,
    isComplete,
    targetingBox,
    handleImageClick,
    handleGuess,
    handleSubmitName,
    dismissTargetingBox,
  } = useGameSession(imageId, image?.characters);

  const handleSubmit = async (playerName) => {
    await handleSubmitName(playerName);
    setModalDismissed(true);
    navigate(`/leaderboard/${imageId}`);
  };

  const handleDismiss = () => {
    setModalDismissed(true);
  };

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <CharacterList
          characters={image.characters}
          foundCharacters={foundCharacters}
        />
      </div>
      <div className={styles.imageWrapper} onClick={handleImageClick}>
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
            onDismiss={dismissTargetingBox}
          />
        )}
      </div>
      {isComplete && !modalDismissed && (
        <PlayerNameModal
          onSubmit={handleSubmit}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};

export default GamePage;
