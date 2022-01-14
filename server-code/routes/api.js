var express = require('express');
var router = express.Router();
var db=require('../dao/query.js');

/* GET api listing. */
router.get('/users', function(req, res, next) {
  db.query('select * from t_user', [],function(result,fields){
    console.log('查询结果：');
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
