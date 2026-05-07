import { useState, useEffect } from 'react';
import { fetchImages } from '../../utils/api';
import ImageCard from '../../components/ImageCard/ImageCard';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages()
      .then(setImages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Where's Waldo?</h1>
      <p className={styles.subtitle}>Choose a scene to start playing</p>
      <div className={styles.grid}>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
