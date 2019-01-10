const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const dao = require('../dao');

const User = {
  id: '1234',
  username: 'admin',
  password: 'admin',
};

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

// on peut ajouter un middleware dans n'importe quel fichier (c'est la même instance)
// middleware sur TOUTES les requêtes
passport.use(new LocalStrategy(
  // paramètres (ces valeurs sont les valeurs par défaut, il n'y aurait techniquement pas besoin de les mettre)
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  // fonction de vérification
  (username, password, done) => {
    // DB query
    if (username === User.username && password === User.password) {
      // 1er param = erreur, 2ème param = user
      done(null, User);
    } else {
      done(null, false);
    }
  },
));

passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    // où est le token: param de l'url, header (et lequel), ...
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    if (userId !== User.id) {
      // l'id dans le token ne correspond à aucun user
      return done(null, false);
    }
    return done(null, User);
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
