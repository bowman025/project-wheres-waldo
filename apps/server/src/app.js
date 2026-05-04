const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const imagesRouter = require('./routes/images');
const sessionsRouter = require('./routes/sessions');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();

app.use(helmet());
app.use(cors());
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
