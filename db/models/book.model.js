const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    available: {type: Boolean, required: true},
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Referencing to user model
    },
    removed: {type: Boolean, default: false}
});
  
const Books = mongoose.model('Book', bookSchema);

module.exports = Books