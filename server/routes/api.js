const express = require('express');
const passport = require('passport');
const dao = require('dao');

const router = express.Router();
const authenticated = () => passport.authenticate('jwt', { session: false });

router.get('/movies', (req, res) => {
  res.send(dao.findAllMovies());
});

router.get('/public', (req, res) => {
  res.send({ message: 'Public message' });
});

router.get('/private', authenticated(), (req, res) => {
  res.send({ message: 'Private message' });
});

router.get('/me', authenticated(), (req, res) => {
  // passeport assigne à user le user passé dans le done (2ème param) de auth.js
  res.send({ user: req.user });
});


module.exports = router;

/* router.get('/welcome', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/me', (req, res) => {
  res.send({ user: null });
}); */
