import styles from './TargetingBox.module.css';

const TargetingBox = ({
  targetingBox,
  characters,
  foundCharacters,
  onGuess,
  onDismiss,
}) => {
  const unfoundCharacters = characters.filter(
    (c) => !foundCharacters.includes(c.id)
  );

  return (
    <>
      <div className={styles.overlay} onClick={onDismiss} />
      <div
        className={styles.box}
        style={{
          left: targetingBox.pixelX,
          top: targetingBox.pixelY,
        }}
      >
        <ul className={styles.list}>
          {unfoundCharacters.map((character) => (
            <li key={character.id}>
              <button
                className={styles.button}
                onClick={() => onGuess(character.id)}
              >
                {character.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TargetingBox;
