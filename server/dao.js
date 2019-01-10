const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = {
  connect: () => {
    mongoose.connect('mongodb+srv://alex:atlaspassword@cluster0-42zus.azure.mongodb.net/test?retryWrites=true', { dbName: 'TE2' });

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
    Movie.find({}, (err, comments) => {
      if (err) {
        res.send(err);
      } else {
        res.json(comments);
      }
    });
  },

  addNewMovie: (req, res) => {
    const comment = new Movie(req.body);
    comment.save((err, com) => {
      if (err) {
        res.send(err);
      } else {
        res.json(com);
      }
    });
  },

  findUserById: (req, res) => {
    User.findById(req.userId, (err, comments) => {
      if (err) {
        res.send(err);
      } else {
        res.json(comments);
      }
    });
  },

  addNewUser: (req, res) => {
    const user = new User(req.body);
    user.save((err, com) => {
      if (err) {
        res.send(err);
      } else {
        res.json(com);
      }
    });
  },
};
