const express = require('express');
const morgan = require('morgan');

const store = require('./store');

const app = express();

app.use(morgan('dev'));

app.get('/movie', (req, res) => {
  let { genre, country, avg_vote } = req.query;

  let results = store;

  if (genre) {
    genre = genre.toLowerCase();
    results = results.filter(result => result.genre.toLowerCase().includes(genre))
  }

  if (country) {
    country = country.toLowerCase();
    results = results.filter(result => result.country.toLowerCase().includes(country))
  }

  if (avg_vote) {
    if (isNaN(avg_vote)) {
      return res.status(400).send('avg_vote must be a number')
    }
    results = results.filter(result => result['avg_vote'] >= Number(avg_vote))
  }

  return res.json(results);
})

app.listen(8080, () => console.log('listening on 8080'));