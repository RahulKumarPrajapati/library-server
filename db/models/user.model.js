const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    role: {type: Number, required: true},
    password: {type: String, required: true},
    deleted: {type: Boolean, default: false}
});
  
const Users = mongoose.model('User', userSchema);

module.exports = Users