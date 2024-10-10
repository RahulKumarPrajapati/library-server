const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books' // Referencing to user model
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Referencing to user model
    },
    issue_date : {type: Date, required: true, default: Date.now},
    return_date : {type: Date},
    actual_return_date: {types: Date}
});
  
const Histories = mongoose.model('History', historySchema);

module.exports = Histories