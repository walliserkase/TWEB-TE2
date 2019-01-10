const mongoose = require('mongoose');
const { atlasConnectionString } = require('../config');

const { Schema } = mongoose;

// Création des schémas

const movieSchema = new Schema({
  _id: Number,
  vote_count: Number,
  video: Boolean,
  vote_average: Number,
  title: String,
  popularity: Number,
  poster_path: String,
  original_language: String,
  original_title: String,
  backdrop_path: String,
  adult: Boolean,
  overview: String,
  release_date: Date,
  tmdb_id: Number,
  genres: Array,
});
const Movie = mongoose.model('movie', movieSchema);

const userSchema = new Schema({
  _id: Number,
  username: String,
  password: String,
  email: String,
});
const User = mongoose.model('user', userSchema);

// Exportation des méthodes offertes par le DAO

module.exports = {
  connect: () => {
    mongoose.connect(atlasConnectionString, { dbName: 'TE2' });

    // When successfully connected
    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection open');
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      console.log(`Mongoose default connection error: ${err}`);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection disconnected');
    });
  },

  findAllMovies: (req, res) => {
    Movie.find({}, (err, movies) => {
      if (err) {
        res.send(err);
      } else {
        res.json(movies);
      }
    });
  },

  addNewMovie: (req, res) => {
    const movie = new Movie(req.body);
    movie.save((err, mov) => {
      if (err) {
        res.send(err);
      } else {
        res.json(mov);
      }
    });
  },

  findUser: (req, res) => {
    User.find({ _id: req.userId }, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        res.json(user);
      }
    });
  },

  findUserByName: (req, res) => {
    User.find({ username: req.username }, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        res.json(user);
      }
    });
  },

  addNewUser: (req, res) => {
    const user = new User(req.body);
    user.save((err, usr) => {
      if (err) {
        res.send(err);
      } else {
    user.save((err, usr) => {
        res.json(usr);
      }
    });
  },
};
