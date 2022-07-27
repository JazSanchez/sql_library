var express = require('express');
const db = require('../models');
var router = express.Router();
const Book = require('../models').Book;




/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  let allBooks = await Book.findAll();
  res.json(allBooks);
});

module.exports = router;
