const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const dao = require('../dao');

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  // fonction de vérification
  (username, password, done) => {
    dao.findUserByName({ username }, (err, user) => {
      if (username === user.username && password === user.password) {
        // 1er param = erreur, 2ème param = user
        done(null, user);
      } else {
        done(null, false);
      }
    });
  },
));

// pour le bonus de la watchlist
passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    // où est le token: param de l'url, header (et lequel), ...
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    dao.findUser({ userId }, (err, user) => {
      if (user) {
        // l'id dans le token ne correspond à aucun user
        return done(null, false);
      }
      return done(null, user);
    });
  },
));

// le 2ème param est un middleware qu'on appelle juste avant la méthode définie
// dans le 3ème paramètre
// session: false => le serveur est stateless
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { password, ...user } = req.user; // on extrait le mdp pour ne pas l'envoyer au client
  const token = jwt.sign({ userId: user.id }, jwtOptions.secret);
  // l'app client reçoit un token permettant d'authentifier toutes ses prochaines requêtes, ainsi
  // que l'user pour l'afficher dans l'interface
  res.send({ user, token });
});

router.post('/register', (req, res) => {
  const { user } = req;
  dao.addNewUser(user);
  res.status(201).send();
});

module.exports = router;
