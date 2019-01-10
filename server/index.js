require('dotenv/config');
const express = require('express');
const cors = require('cors');
//const bodyParser = require('body-parser');
const dao = require('./dao');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');

const app = express();

app.use(express.json());
//app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at localhost:${port}`);
});
