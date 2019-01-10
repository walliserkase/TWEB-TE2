const express = require('express');
const dao = require('../dao');

const router = express.Router();

// connexion à la DB lorsqu'on arrive sur la page /api/
router.get('/', (req, res) => {
  dao.connect();
});

router.get('/movies', (req, res) => {
  res.send(dao.findAllMovies());
});

module.exports = router;
