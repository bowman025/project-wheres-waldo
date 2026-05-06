import styles from './CharacterList.module.css';

const CharacterList = ({ characters, foundCharacters }) => {
  return (
    <ul className={styles.list}>
      {characters.map((character) => {
        const found = foundCharacters.includes(character.id);
        return (
          <li
            key={character.id}
            className={`${styles.item} ${found ? styles.found : ''}`}
          >
            <span className={styles.indicator}>{found ? '✓' : '○'}</span>
            {character.name}
          </li>
        );
      })}
    </ul>
  );
};

export default CharacterList;
