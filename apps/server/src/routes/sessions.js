const { Router } = require('express');
const {
  startSession,
  validateGuess,
  completeSession,
} = require('../controllers/sessionController');

const router = Router();

router.post('/', startSession);
router.post('/:token/validate', validateGuess);
router.post('/:token/complete', completeSession);

module.exports = router;
