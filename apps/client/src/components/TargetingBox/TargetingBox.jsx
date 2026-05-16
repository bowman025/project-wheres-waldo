import styles from './TargetingBox.module.css';

const TargetingBox = ({
  targetingBox,
  characters,
  foundCharacters,
  onGuess,
}) => {
  const unfoundCharacters = characters.filter(
    (c) => !foundCharacters.includes(c.id)
  );

  return (
    <>
      <div
        className={styles.box}
        style={{
          left: `clamp(0px, ${targetingBox.pixelX}px, calc(100% - 160px))`,
          top: targetingBox.pixelY,
          transform: 'translateY(8px)',
        }}
        onClick={(e) => e.stopPropagation()}
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
