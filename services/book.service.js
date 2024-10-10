const { mongoose } = require('mongoose');
const { MESSAGE, ROLE } = require('../CONSTANT');
const Books = require('../db/models/book.model');
const Users = require('../db/models/user.model');
const Histories = require('../db/models/history.model');

exports.add = async (data) => {
    try{
        //Getting user
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user){
            //Checking if user is LIBRARIAN and then adding the book
            if (user.role === ROLE.LIBRARIAN){
                const book = new Books({
                    name: data.bookName,
                    available: true
                });
                await book.save();
                return {message: MESSAGE.book_added_successfully}
            }
            //If user is not LIBRARIAN then it's an unauthorized access
            else{
                return {message: MESSAGE.unauthorized_user}
            }
            
        }
        //If user not found then it's an unauthorized access
        else{
            return {message: MESSAGE.unauthorized_user}
        }
        
    }
    catch(err){
        throw err;
    }
};

// Function to assign book to a member
exports.assign = async (bookData) => {
    try{
        const book = await Books.findOne({_id: new mongoose.Types.ObjectId(bookData.book_id)});
        if(book){
            if(book.available){
                const member = await Users.findOne({_id: new mongoose.Types.ObjectId(bookData.member_id)});
                if(member.role === ROLE.LIBRARIAN){
                    return {message: MESSAGE.cannot_assign_book_to_librarian}
                }
                const result = await Books.updateOne({_id: new mongoose.Types.ObjectId(bookData.book_id)}, {$set: {available: false, user_id: new mongoose.Types.ObjectId(bookData.member_id)}})
                if(result.modifiedCount >= 1){
                    await Histories.create({
                        book_id: new mongoose.Types.ObjectId(bookData.book_id),
                        user_id: new mongoose.Types.ObjectId(bookData.member_id)
                    });
                    return {message: MESSAGE.book_assigned_successfully}
                }
                return {message: MESSAGE.error_assigning_book}
            }
            else{
                return {message: MESSAGE.book_already_assigned}
            }
            
        }
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

// Function to return book back
exports.returnBook = async (bookData) => {
    try{
        //Getting user
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(bookData.member_id)});
        if(user){
            //Checking if user is MEMBER and then assigning the book
            if (user.role === ROLE.MEMBER){
                const book = await Books.findOne({_id: new mongoose.Types.ObjectId(bookData.book_id)});
                if(book){
                    if(!book.available && book.user_id == bookData.member_id){
                        const result = await Books.updateOne({_id: new mongoose.Types.ObjectId(bookData.book_id)}, {$set: {available: true}, $unset: {user_id: 1}})
                        if(result.modifiedCount >= 1){
                            await Histories.updateOne({
                                book_id: new mongoose.Types.ObjectId(bookData.book_id),
                                user_id: new mongoose.Types.ObjectId(bookData.member_id),
                                return_date: null
                            }, {return_date: new Date()});
                            return {message: MESSAGE.book_returned_successfully}
                        }
                        return {message: MESSAGE.error_returning_book}
                    }
                    else{
                        return {message: MESSAGE.unauthorized_user}
                    }
                    
                }
                else{
                    return {message: MESSAGE.book_not_exists}
                }
            }
            //If user is not MEMBER then it's an unauthorized access
            else{
                return {message: MESSAGE.unauthorized_user}
            }
            
        }
        //If user not found then it's an unauthorized access
        else{
            return {message: MESSAGE.unauthorized_user}
        }
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

exports.getBooks = async (data) => {
    try{
        console.log(data)
        let query = {removed: false};
        console.log('Data',data)
        if(data.availableOnly == 'true'){
            query = {...query, available: true}
        }
        console.log(query)
        const books = await Books.find(query);
        return books;
    }
    catch(err){
        throw err;
    }
}

exports.getBorrowedBooks = async (data) => {
    try{
        const borrowedBooks = await Books.find({user_id: new mongoose.Types.ObjectId(data.user_id)});
        return borrowedBooks;
    }
    catch(err){
        throw err;
    }
}

exports.borrowedBooksHitory = async (data) => {
    try{
        let condition = [];
        if(data.role == ROLE.MEMBER){
            condition = [
                { user_id:  new mongoose.Types.ObjectId(data.user_id) },
                { return_date: { $ne: null } }
            ]
        }
        else{
            condition = [
                { return_date: { $ne: null } }
            ]
        }
        const borrowedBooks = await Histories.aggregate([
            {
                $match: {
                    $and: condition
                }
            },
            {
                $lookup: {
                  from: 'books',
                  localField: 'book_id',
                  foreignField: '_id',
                  as: 'book'
                }
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user'
                }
            },
            {
                $project: {                 // Include history _id
                    user_id: 1,              // Include user_id from Histories
                    book_id: 1,              // Include book_id from Histories
                    issue_date: 1,          // Include borrow_date
                    return_date: 1,          // Include return_date
                    book_name: { $arrayElemAt: ["$book.name", 0] },
                    username: { $arrayElemAt: ["$user.username", 0] }
                }
            }
        ]);
        return borrowedBooks;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}

exports.deleteBook = async(data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}
        }
        await Books.updateOne({_id: new mongoose.Types.ObjectId(data.book_id)}, {$set: {removed: true}})
        return {message: MESSAGE.book_deleted_successfully};
    }
    catch(err){
        throw err;
    }
}

exports.updateBook = async (data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}
        }
        await Books.updateOne({_id: new mongoose.Types.ObjectId(data.book_id)}, {$set: {name: data.name}})
        return {message: MESSAGE.book_updated_successfully};
    }
    catch(err){
        throw err;
    }
}