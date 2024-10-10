const express = require('express');
const userService = require('../services/user.service');
const { ACCESS_CODE, MESSAGE } = require('../CONSTANT');
const router = express.Router();
const BASE_URI = '/users'

// Register user
router.post(BASE_URI + '/register', async (req, res) => {
    try {
        const result = await userService.signup(req) // Create user
        if(result.message === MESSAGE.user_registered_successfully){
            res.status(ACCESS_CODE.ENTRY_CREATED).json(result); // Send created user data with 201 Created status
        }
        else if(result.message === MESSAGE.not_a_valid_role){
            res.status(ACCESS_CODE.BAD_REQUEST).json(result);   // Not a valid role
        }
        else{
            res.status(ACCESS_CODE.DATA_ALREADY_PRESENT).json(result); // Username already exist
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_registering_user, error: error.message }); // Send user-friendly error message
    }
});

//User login
router.post(BASE_URI + '/login', async (req, res) => {
    try {
        const result = await userService.signin(req);
        if(result.message === MESSAGE.user_not_found){
            res.status(ACCESS_CODE.DATA_NOT_FOUND).json({result}); //User not found
        }
        else if(result.message == MESSAGE.invalid_password){
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);     //Unauthorized access
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);          //Successful user login
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_logging_user, error: error }); // Send user-friendly error message
    }
});

//Delete user
router.post(BASE_URI + '/delete', async (req, res) => {
    try {
        const result = await userService.deleteUser(req.body);
        if(result.message === MESSAGE.user_has_borrowed_books){     //User has books to be returned
            res.status(ACCESS_CODE.BAD_REQUEST).json({result});
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);           //Succesful user deletion
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_deleting_user, error: error }); // Send user-friendly error message
    }
});

//Get all users
router.get(BASE_URI + '/getAllUsers', async (req, res) => {
    try {
        const result = await userService.getAllUser(req.query);
        if(result.message === MESSAGE.unauthorized_user){           //Unauthorized access
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);           //Successful
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_getting_users, error: error }); // Send user-friendly error message
    }
});

router.post(BASE_URI + '/update', async (req, res) => {
    try {
        const result = await userService.updateUser(req.body);
        if(result.message == MESSAGE.unauthorized_user){
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result);      //Unauthorized access
        }
        else{
            res.status(ACCESS_CODE.SUCCESS).json(result);           //Successful user updation
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_updating_user, error: error }); // Send user-friendly error message
    }
});

router.post(BASE_URI + '/add', async (req, res) => {
    try {
        const result = await userService.addUser(req.body) // Create user
        if(result.message === MESSAGE.user_registered_successfully){
            res.status(ACCESS_CODE.ENTRY_CREATED).json(result); // Send created user data with 201 Created status
        }
        else if(result.message === MESSAGE.unauthorized_user){
            res.status(ACCESS_CODE.UNAUTHORIZED).json(result); // Unauthorized Access
        }
        else{
            res.status(ACCESS_CODE.DATA_ALREADY_PRESENT).json(result); // Username already exist
        }
    } catch (error) {
        res.status(ACCESS_CODE.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.error_registering_user, error: error.message }); // Send user-friendly error message
    }
});
    
module.exports = router;