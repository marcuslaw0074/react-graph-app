var express = require('express');
var data = require('./data');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(data);
}).post('/', function(req, res, next) {
  print(req.body)
  res.send("success")
})

module.exports = router;
