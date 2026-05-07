import styles from './Timer.module.css';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Timer = ({ seconds }) => {
  return <div className={styles.timer}>{formatTime(seconds)}</div>;
};

export default Timer;
