var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile( global.appRoot + '/public/pages/index.html');
});

module.exports = router;
