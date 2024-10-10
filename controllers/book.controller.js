const express = require('express');
const bookService = require('../services/book.service');
const { ACCESS_CODE, MESSAGE } = require('../CONSTANT');
const router = express.Router();
const BASE_URI = '/books'


router.post(BASE_URI + '/add', async (req, res) => {
    try {
        const result = await bookService.add(req.body) // Add book
        if(result.message === MESSAGE.book_added_successfully){
            res.status(ACCESS_CODE.ENTRY_CREATED).json(result); // Book added
        }
        else{
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result); // Book added
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_adding_book, error: error.message }); // Send user-friendly error message
    }
});

router.post(BASE_URI + '/assign', async (req, res) => {
    try {
        const result = await bookService.assign(req.body);
        res.status(ACCESS_CODE.SUCCESS).json(result);
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_assigning_book, error: error }); // Send user-friendly error message
    }
});

router.post(BASE_URI + '/returnBook', async (req, res) => {
    try {
        const result = await bookService.returnBook(req.body);
        res.status(ACCESS_CODE.SUCCESS).json(result);
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_returning_book, error: error }); // Send user-friendly error message
    }
});

router.get(BASE_URI + '/getBooks', async (req, res) => {
    try {
        const result = await bookService.getBooks(req.query);
        res.status(ACCESS_CODE.SUCCESS).json(result);
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});
    
router.get(BASE_URI + '/getBorrowedBooks', async (req, res) => {
    try {
        const result = await bookService.getBorrowedBooks(req.query);
        res.status(ACCESS_CODE.SUCCESS).json(result);
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});

router.get(BASE_URI + '/getBorrowedBooksHistory', async (req, res) => {
    try {
        const result = await bookService.borrowedBooksHitory(req.query);
        res.status(ACCESS_CODE.SUCCESS).json(result);
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});

router.post(BASE_URI + '/delete', async (req, res) => {
    try {
        const result = await bookService.deleteBook(req.body);
        if(result.message == MESSAGE.unauthorized_user){
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_books, error: error }); // Send user-friendly error message
    }
});

router.post(BASE_URI + '/update', async (req, res) => {
    try {
        const result = await bookService.updateBook(req.body);
        if(result.message == MESSAGE.unauthorized_user){
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_updating_book, error: error }); // Send user-friendly error message
    }
});

module.exports = router;