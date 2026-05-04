const { Router } = require('express');
const { getLeaderBoard } = require('../controllers/leaderboardController');

const router = Router();

router.get('/', getLeaderBoard);

module.exports = router;
