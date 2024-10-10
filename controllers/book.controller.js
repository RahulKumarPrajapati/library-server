const express = require('express');
const bookService = require('../services/book.service');
const { ACCESS_CODE, MESSAGE } = require('../CONSTANT');
const router = express.Router();
const BASE_URI = '/books'

//Add book
router.post(BASE_URI + '/add', async (req, res) => {
    try {
        const result = await bookService.add(req.body)
        if(result.message === MESSAGE.book_added_successfully){
            res.status(ACCESS_CODE.ENTRY_CREATED).json(result);     // Book added
        }
        else{
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);      //Unauthorized access
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_adding_book, error: error.message }); // Send user-friendly error message
    }
});

//Assign Book
router.post(BASE_URI + '/assign', async (req, res) => {
    try {
        const result = await bookService.assign(req.body);
        if(result.message === MESSAGE.cannot_assign_book_to_librarian){     //Can't assign book to librarian
            res.status(ACCESS_CODE.BAD_REQUEST).json(result);
        }
        else if(result.message === MESSAGE.error_assigning_book){           //Error assigning book
            res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json(result);
        }
        else if(result.message === MESSAGE.book_already_assigned){          //Book already assigned
            res.status(ACCESS_CODE.BAD_REQUEST).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);                   //Successful assignment of book
        }               //Successful assignment of book
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_assigning_book, error: error }); // Send user-friendly error message
    }
});

//Return Book
router.post(BASE_URI + '/returnBook', async (req, res) => {
    try {
        const result = await bookService.returnBook(req.body);
        if(result.message === MESSAGE.book_not_exists){                     //Book not found
            res.status(ACCESS_CODE.DATA_NOT_FOUND).json(result);
        }
        else if(result.message === MESSAGE.error_returning_book){           //Error returning book
            res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json(result);
        }
        else if(result.message === MESSAGE.unauthorized_user){              //Unauthorized access
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);                   //Successful return
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_returning_book, error: error }); // Send user-friendly error message
    }
});

//Get Books list
router.get(BASE_URI + '/getBooks', async (req, res) => {
    try {
        const result = await bookService.getBooks(req.query);
        res.status(ACCESS_CODE.SUCCESS).json(result);                       //All books fetched successfully
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});

//Get borrowed books list
router.get(BASE_URI + '/getBorrowedBooks', async (req, res) => {
    try {
        const result = await bookService.getBorrowedBooks(req.query);
        res.status(ACCESS_CODE.SUCCESS).json(result);                       //All borrowed books fetched successfully
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});

//Get all borrowed books history
router.get(BASE_URI + '/getBorrowedBooksHistory', async (req, res) => {
    try {
        const result = await bookService.borrowedBooksHitory(req.query);
        res.status(ACCESS_CODE.SUCCESS).json(result);                       //All books history fetched successfully
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});


//Delete book
router.post(BASE_URI + '/delete', async (req, res) => {
    try {
        const result = await bookService.deleteBook(req.body);
        if(result.message == MESSAGE.unauthorized_user){                    //Unauthorized access
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);                   //Successful book deletion
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});

//Update bokk data
router.post(BASE_URI + '/update', async (req, res) => {
    try {
        const result = await bookService.updateBook(req.body);
        if(result.message == MESSAGE.unauthorized_user){                    //All borrowed books fetched successfully
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);                   //Book updated successfully
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_updating_book, error: error }); // Send user-friendly error message
    }
});

module.exports = router;