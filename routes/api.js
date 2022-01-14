var express = require('express');
var router = express.Router();

/* GET api listing. */
router.get('/users', function(req, res, next) {
  res.set('Content-Type', 'application/json');
  res.json([{"username": "wanyicheng"},{"username": "yupengtao"}]);
});

module.exports = router;
