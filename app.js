
const express = require('express');
const connectDB = require('./database');
require('dotenv').config()
const cors = require('cors');

const app = express()
const UserController = require('./controllers/user.controller');
const BookController = require('./controllers/book.controller');
const port = process.env.PORT;

app.use(cors({
    origin: '*',
    credentials: true
}));

connectDB();

app.use(express.json());  // Enable JSON body parsing
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Welcome to Library Management Server!')
})

app.use('/api', UserController);
app.use('/api', BookController);

app.listen(port, () => {
    console.log(`Server running`);
})