import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchLeaderboard, fetchImages } from '../../utils/api';
import LeaderboardTable from '../../components/LeaderboardTable/LeaderboardTable';
import styles from './LeaderboardPage.module.css';

const LeaderboardPage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || null;

  const [scores, setScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageImage, setImageImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchLeaderboard(imageId, token),
      fetchImages(),
    ])
      .then(([leaderboard, images]) => {
        setScores(leaderboard.scores);
        setCurrentPlayer(leaderboard.currentPlayer);
        const image = images.find((img) => img.id === Number(imageId));
        if (image) {
          setImageName(image.name);
          setImageImage(image.url);
        };
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [imageId, token]);

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Leaderboard</h1>
      {imageName && <p className={styles.subtitle}>{imageName}</p>}
      {imageImage &&
        <div className={styles.imageWrapper}>
          <img className={styles.image} src={imageImage} alt={imageName} />
        </div>
      }
      <LeaderboardTable scores={scores} currentPlayer={currentPlayer} />
      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => navigate(`/game/${imageId}`)}
        >
          Play Again
        </button>
        <button
          className={styles.button}
          onClick={() => navigate('/')}
        >
          Choose Another Image
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;