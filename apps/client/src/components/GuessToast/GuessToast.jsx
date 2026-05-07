import styles from './GuessToast.module.css';

const GuessToast = ({ guessResult }) => {
  if (!guessResult) return null;

  return (
    <div
      className={`${styles.toast} ${guessResult.correct ? styles.correct : styles.wrong}`}
    >
      {guessResult.correct
        ? `✓ Found ${guessResult.characterName}!`
        : '✗ Not quite, try again!'}
    </div>
  );
};

export default GuessToast;
