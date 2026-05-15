import { useNavigate } from 'react-router-dom';
import styles from './ImageCard.module.css';

const ImageCard = ({ image }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/game/${image.id}`)}>
      <div className={styles.imageWrapper}><img src={image.url} alt={image.name} className={styles.image} /></div>
      <div className={styles.info}>
        <h2 className={styles.name}>{image.name}</h2>
        <p className={styles.characters}>
          {image.characters.length} characters to find
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
