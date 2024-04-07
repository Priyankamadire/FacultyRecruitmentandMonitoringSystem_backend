const express = require('express');
const mongoose = require('mongoose'); // Corrected the import statement
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
app.use(cookieParser());
dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 5000; // Added default port

// Middleware to enable CORS
// const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Allow credentials (cookies) to be sent
}));


app.use(express.json());


require('./db/conn');
   
app.use(require('./router/auth'));
app.use(require('./router/clgauth'));
app.use(require('./router/postauth'));
app.use(require('./router/applyauth'))
app.use(require('./router/dauth'))
app.use(require('./router/retaitauth'))
app.use(require('./router/newauth'))
app.use(require('./router/notifiauth'))
app.use(require('./router/umess'))
app.use(require('./router/contauth'))




app.get('/contact', (req, res) => {
    res.send('Hi, welcome to the contact page');
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
