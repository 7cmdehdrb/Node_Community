var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  let session = req.session;

  res.render('index', { session: session });

});

module.exports = router;
