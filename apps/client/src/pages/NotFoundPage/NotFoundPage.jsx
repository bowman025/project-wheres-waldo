import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>The link might be broken or the page was moved.</p>
      <Link to="/" className={styles.btn}>Return Home</Link>
    </div>
  );
}

export default NotFoundPage;
