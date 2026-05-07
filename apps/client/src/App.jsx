import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import GamePage from './pages/GamePage/GamePage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:imageId" element={<GamePage />} />
      <Route path="/leaderboard/:imageId" element={<LeaderboardPage />} />
    </Routes>
  );
}

export default App;
