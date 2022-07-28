var express = require('express');
var router = express.Router();
const Book = require('../models').Book;


// /* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */

router.get('/', async function(req, res) {
  res.redirect("/books");
});

/* Shows the full list of books. */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", {books: books, title: "Books"});
}));


router.get('/books/new', asyncHandler(async (req, res)=> {
  res.render('new-book', {book: {}, title: 'New Book'})
}))


router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new", { books: book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));



router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('books/update',{books: book, title: book.title} )

}))

router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("books/:id", { books: book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

router.post('/book/:id/delete', asyncHandler(async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}))




module.exports = router;
