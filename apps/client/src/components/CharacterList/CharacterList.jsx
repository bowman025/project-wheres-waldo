import styles from './CharacterList.module.css';

const CharacterList = ({ characters, foundCharacters }) => {
  return (
    <ul className={styles.list}>
      {characters.map((character) => {
        const found = foundCharacters.includes(character.id);
        return (
          <li key={character.id} className={styles.item}>
            <div className={styles.portraitWrapper}>
              {character.portraitUrl ? (
                <img
                  src={character.portraitUrl}
                  alt={character.name}
                  className={`${styles.portrait} ${found ? styles.foundPortrait : ''}`}
                  draggable={false}
                />
              ) : (
                <div className={`${styles.portraitPlaceholder} ${found ? styles.foundPortrait : ''}`} />
              )}
              {found && (
                <div className={styles.overlay}>
                  <span className={styles.checkmark}>✓</span>
                </div>
              )}
            </div>
            <span className={`${styles.name} ${found ? styles.foundName : ''}`}>
              {character.name}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default CharacterList;
