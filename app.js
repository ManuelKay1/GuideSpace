const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const studentroutes = require('./Routes/studentroutes');
const lecturerroutes = require('./Routes/lecturerroutes');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/readmore', (req, res) => {
    res.render('readmore');
});

app.use(studentroutes); 
app.use( lecturerroutes); 

app.listen(3000, () => console.log('Listening to request on port 3000'));
