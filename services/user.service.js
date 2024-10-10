var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const Users = require('../db/models/user.model');
const Books = require('../db/models/book.model');
const mongoose = require('mongoose');
const { MESSAGE, ROLE } = require("../CONSTANT");

exports.signup = async (req) => {
    try{
        let isUserPresent = await Users.findOne({username: req.body.username}).countDocuments();
        console.log(isUserPresent)
        if(!isUserPresent){
            const user = new Users({
                username: req.body.username,
                role: req.body.role,
                password: bcrypt.hashSync(req.body.password, 8)
            });
            
            await user.save();
            return {
                message: MESSAGE.user_registered_successfully
            };
        }
        else{
            return {
                message: MESSAGE.username_already_exist
            }
        }
    }
    catch(err){
        throw err;
    }
};

exports.signin = async (req) => {
    try{
        let user = await Users.findOne({username: req.body.username, $or: [{ deleted: false }, { deleted: null }]})
        if (!user) {
            return {
                message: MESSAGE.user_not_found
            }
        }
    
        //comparing passwords
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return {
                accessToken: null,
                message: MESSAGE.invalid_password,
            }
        }
        //signing token with user id
        var token = jwt.sign({id: user._id}, process.env.SECRET_API_KEY);
    
        //responding to client request with user profile success message and  access token .
        return {
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            message: MESSAGE.login_successful,
            accessToken: token,
        }
    }
    catch(err){
        throw err;
    }
};

exports.deleteUser = async (data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.LIBRARIAN){
            return {message: MESSAGE.cannot_delete_librarian}
        }
        const borrowedBooks = await Books.find({user_id: new mongoose.Types.ObjectId(data.user_id)}).countDocuments();
        if(borrowedBooks > 0){
            return {message: MESSAGE.user_has_borrowed_books};
        }
        else{
            await Users.updateOne({_id: new mongoose.Types.ObjectId(data.user_id)}, {$set: {deleted: true}});
            return {message: MESSAGE.user_deleted_successfully};
        }
    }
    catch(err){
        throw err;
    }
}

exports.getAllUser = async (data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}
        }
        const users = await Users.find({role: ROLE.MEMBER}, {password:0})
        return users;
    }
    catch(err){
        throw err;
    }
}

exports.updateUser = async (data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}
        }
        await Users.updateOne({_id: new mongoose.Types.ObjectId(data.member_id)}, {$set: {username: data.username}})
        return {message: MESSAGE.user_updated_successfully};
    }
    catch(err){
        throw err;
    }
}

exports.addUser = async (data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}
        }
        let isUserPresent = await Users.findOne({username: data.username}).countDocuments();
        if(!isUserPresent){
            const user = new Users({
                username: data.username,
                role: ROLE.MEMBER,
                password: bcrypt.hashSync(data.password, 8)
            });
            
            await user.save();
            return {
                message: MESSAGE.user_registered_successfully
            };
        }
        else{
            return {
                message: MESSAGE.username_already_exist
            }
        }
    }
    catch(err){
        console.log(err)
        throw err;
    }
};