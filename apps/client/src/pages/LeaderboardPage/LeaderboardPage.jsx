import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLeaderBoard, fetchImages } from '../../utils/api';
import LeaderboardTable from '../../components/LeaderboardTable/LeaderboardTable';
import styles from './LeaderboardPage.module.css';

const LeaderboardPage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchLeaderBoard(imageId), fetchImages()])
      .then(([leaderboard, images]) => {
        setScores(leaderboard);
        const image = images.find((img) => img.id === Number(imageId));
        if (image) setImageName(image.name);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [imageId]);

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Leaderboard</h1>
      {imageName && <p className={styles.subtitle}>{imageName}</p>}
      <LeaderboardTable scores={scores} />
      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => navigate(`/game/${imageId}`)}
        >
          Play Again
        </button>
        <button className={styles.button} onClick={() => navigate('/')}>
          Choose Another Image
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
