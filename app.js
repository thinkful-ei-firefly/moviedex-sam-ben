require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const store = require('./store');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', function handleGetMovie(req, res) {
  let { genre, country, avg_vote } = req.query;

  let results = store;

  if (genre) {
    genre = genre.toLowerCase();
    results = results.filter(result =>
      result.genre.toLowerCase().includes(genre)
    );
  }

  if (country) {
    country = country.toLowerCase();
    results = results.filter(result =>
      result.country.toLowerCase().includes(country)
    );
  }

  if (avg_vote) {
    if (isNaN(avg_vote)) {
      return res.status(400).send('avg_vote must be a number');
    }
    results = results.filter(result => result['avg_vote'] >= Number(avg_vote));
  }

  return res.json(results);
});

app.listen(8080, () => console.log('listening on 8080'));
