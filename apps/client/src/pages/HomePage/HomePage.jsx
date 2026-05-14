import { useState, useEffect } from 'react';
import { fetchImages } from '../../utils/api';
import ImageCard from '../../components/ImageCard/ImageCard';
import SlowLoadingBanner from '../../components/SlowLoadingBanner/SlowLoadingBanner';
import useSlowLoading from '../../hooks/useSlowLoading';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSlow = useSlowLoading(loading);

  useEffect(() => {
    fetchImages()
      .then(setImages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.page}>
      {loading && isSlow && <SlowLoadingBanner />}
      {loading ? (
        <p className={styles.status}>Loading...</p>
      ) : (
        <>
          <p className={styles.subtitle}>Choose a scene to start playing</p>
          <div className={styles.grid}>
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
