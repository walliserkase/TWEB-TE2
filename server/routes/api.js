const dao = require('../dao');

const router = express.Router();

router.get('/', (req, res) => {
  dao.connect();
});

router.get('/movies', (req, res) => {
  res.send(dao.findAllMovies());
});

module.exports = router;
