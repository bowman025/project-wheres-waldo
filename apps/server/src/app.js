const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const imagesRouter = require('./routes/images');
const sessionsRouter = require('./routes/sessions');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

app.use('/api/images', imagesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal server error.' });
});

module.exports = app;
