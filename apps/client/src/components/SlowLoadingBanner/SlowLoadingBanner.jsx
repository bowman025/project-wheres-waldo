import styles from './SlowLoadingBanner.module.css';

const SlowLoadingBanner = () => {
  return (
    <div className={styles.banner}>
      <span className={styles.spinner} />
      Waking up the server... This may take up to a minute on first load.
    </div>
  );
};

export default SlowLoadingBanner;
