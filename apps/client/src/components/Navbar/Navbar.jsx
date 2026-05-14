import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <button className={styles.logo} onClick={() => navigate('/')}>
        FindEm
      </button>
    </nav>
  );
};

export default Navbar;
