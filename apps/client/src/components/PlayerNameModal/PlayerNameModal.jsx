import { useState } from 'react';
import styles from './PlayerNameModal.module.css';

const PlayerNameModal = ({ onSubmit, onDismiss }) => {
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setSubmitting(true);
    await onSubmit(playerName.trim());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>You found them all! 🎉</h2>
        <p className={styles.subtitle}>Enter your name for the leaderboard</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={32}
            autoFocus
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.skipButton}
              onClick={onDismiss}
            >
              Skip
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!playerName.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerNameModal;
