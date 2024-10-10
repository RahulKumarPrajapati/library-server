const { mongoose } = require('mongoose');
const { MESSAGE, ROLE } = require('../CONSTANT');
const Books = require('../db/models/book.model');
const Users = require('../db/models/user.model');
const Histories = require('../db/models/history.model');

//Add Book function
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
        if(book){   //Checking if given book exists
            if(book.available){     // Checking if book is available to be assigned
                const member = await Users.findOne({_id: new mongoose.Types.ObjectId(bookData.member_id)});
                if(member.role === ROLE.LIBRARIAN){    //Checking if not assigning to librarian 
                    return {message: MESSAGE.cannot_assign_book_to_librarian}
                }
                //Successful book assignment
                const result = await Books.updateOne({_id: new mongoose.Types.ObjectId(bookData.book_id)}, {$set: {available: false, user_id: new mongoose.Types.ObjectId(bookData.member_id)}})
                if(result.modifiedCount >= 1){
                    await Histories.create({
                        book_id: new mongoose.Types.ObjectId(bookData.book_id),
                        user_id: new mongoose.Types.ObjectId(bookData.member_id)
                    });
                    return {message: MESSAGE.book_assigned_successfully}
                }
                //Error assigning book
                return {message: MESSAGE.error_assigning_book}
            }
            //Book already assigned
            else{
                return {message: MESSAGE.book_already_assigned}
            }
            
        }
        //Book not exists
        else{
            return {message: MESSAGE.book_not_exists}
        }
    }
    catch(err){
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
                if(book){   //Checking if given book exists
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
                        //Error returning book
                        return {message: MESSAGE.error_returning_book}
                    }
                    //Unauthorized access
                    else{
                        return {message: MESSAGE.unauthorized_user}
                    }
                    
                }
                //Given book doesn't exist
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
        throw err;
    }
}

//Get Book list
exports.getBooks = async (data) => {
    try{
        let query = {removed: false};
        if(data.availableOnly == 'true'){
            query = {...query, available: true}
        }
        const books = await Books.find(query);
        return books;
    }
    catch(err){
        throw err;
    }
}

//Get Borrowed book list
exports.getBorrowedBooks = async (data) => {
    try{
        const borrowedBooks = await Books.find({user_id: new mongoose.Types.ObjectId(data.user_id)});
        return borrowedBooks;
    }
    catch(err){
        throw err;
    }
}

//Get Borrowed books history list

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
                $project: {
                    user_id: 1,
                    book_id: 1,
                    issue_date: 1,
                    return_date: 1,
                    book_name: { $arrayElemAt: ["$book.name", 0] },
                    username: { $arrayElemAt: ["$user.username", 0] }
                }
            }
        ]);
        return borrowedBooks;
    }
    catch(err){
        throw err;
    }
}

//Delete Book function
exports.deleteBook = async(data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}         //Unauthorized access
        }
        await Books.updateOne({_id: new mongoose.Types.ObjectId(data.book_id)}, {$set: {removed: true}})
        return {message: MESSAGE.book_deleted_successfully};    //Successful book deletion
    }
    catch(err){
        throw err;
    }
}

//Update book list
exports.updateBook = async (data) => {
    try{
        const user = await Users.findOne({_id: new mongoose.Types.ObjectId(data.user_id)});
        if(user.role == ROLE.MEMBER){
            return {message: MESSAGE.unauthorized_user}         //Unauthorized access
        }
        await Books.updateOne({_id: new mongoose.Types.ObjectId(data.book_id)}, {$set: {name: data.name}})
        return {message: MESSAGE.book_updated_successfully};    //Successful book updation
    }
    catch(err){
        throw err;
    }
}