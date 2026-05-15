import styles from './LeaderboardTable.module.css';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const LeaderboardTable = ({ scores, currentPlayer }) => {
  if (scores.length === 0 && !currentPlayer) {
    return <p className={styles.empty}>No scores yet. Be the first!</p>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Player</th>
            <th className={styles.th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index} className={styles.row}>
              <td className={styles.td}>{index + 1}</td>
              <td className={styles.td}>{score.playerName}</td>
              <td className={styles.td}>{formatTime(score.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentPlayer && (
        <div className={styles.currentPlayer}>
          <p className={styles.currentPlayerLabel}>Your score</p>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.currentPlayerRow}>
                <td className={styles.td}>{currentPlayer.rank}</td>
                <td className={styles.td}>{currentPlayer.playerName}</td>
                <td className={styles.td}>{formatTime(currentPlayer.time)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
