import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import GamePage from './pages/GamePage/GamePage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import DevPage from './pages/DevPage/DevPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:imageId" element={<GamePage />} />
          <Route path="/leaderboard/:imageId" element={<LeaderboardPage />} />
          {import.meta.env.VITE_DEV_TOOLS === 'true' && (
            <Route path="/dev" element={<DevPage />} />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
