import { useState, useEffect } from 'react';
import { fetchImages } from '../../utils/api';
import styles from './DevPage.module.css';

const DevPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    fetchImages().then(setImages);
  }, []);

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setClicks((prev) => [...prev, { x: x.toFixed(4), y: y.toFixed(4) }]);
  };

  return (
    <div className={styles.page}>
      <h1>Coordinate Picker</h1>
      <p>Click the center of each character to record their coordinates.</p>
      {!selectedImage ? (
        <div className={styles.picker}>
          {images.map((img) => (
            <button key={img.id} onClick={() => setSelectedImage(img)}>
              {img.name}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.workspace}>
          <div className={styles.sidebar}>
            <h2>{selectedImage.name}</h2>
            <p>Clicks recorded:</p>
            <ol className={styles.clickList}>
              {clicks.map((click, i) => (
                <li key={i}>
                  x: {click.x}, y: {click.y}
                </li>
              ))}
            </ol>
            <button onClick={() => setClicks([])}>Clear</button>
            <button onClick={() => setSelectedImage(null)}>Back</button>
          </div>
          <div className={styles.imageWrapper} onClick={handleImageClick}>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className={styles.image}
              draggable={false}
            />
            {clicks.map((click, i) => (
              <div
                key={i}
                className={styles.marker}
                style={{
                  left: `${click.x * 100}%`,
                  top: `${click.y * 100}%`,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevPage;
