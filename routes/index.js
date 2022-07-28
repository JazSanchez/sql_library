var express = require('express');
const { BULKDELETE } = require('sequelize/types/query-types');
const db = require('../models');
var router = express.Router();
const Book = require('../models').Book;




/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  let everyBook = (async () => {
    await db.sequelize.sync({ force: true });
    try {
       const allBooks = await Book.finalAll();
       console.log(allBooks.map(books => books.toJSON() ))
    }catch(error){
    
    }
  })
  res.json(everyBook);
});

module.exports = router;
