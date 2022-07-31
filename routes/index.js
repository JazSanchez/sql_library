var express = require('express');
var router = express.Router();
const Book = require('../models').Book;


// Handler function to wrap each route. 
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

// GET home page. 

router.get('/', async function(req, res) {
  res.redirect("/books");
});

// Shows the full list of books. 
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", {books: books, title: "Books"});
}));

//Render page where you can input a new book
router.get('/books/new', asyncHandler(async (req, res)=> {
  res.render('new-book', {book: {}, title: 'New Book'})
}))

// Render page where you can submit a new book or through an error if a form is submitted incorrectly
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", { books: book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));


// Render the update page 
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("update-book", {book: book, title:"Update Book"} )
 }));

//  Update the information on a book 
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/"); 
    } else {

      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("update-book", { books: book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));


//Delete a book
router.post('/books/:id/delete', asyncHandler(async (req, res)=>{
  const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books/");
}))




module.exports = router;
