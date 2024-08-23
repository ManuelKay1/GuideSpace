const express = require('express');
const  mongoose  = require('mongoose');
const Student = require('./models/Student');
const Lecturer = require('./models/Lecturer'); 
const app = express();

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

const dbURI="mongodb+srv://KwameAcquah:Business20b@cluster0.s2ii5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to db:', err);
  });

app.set('view engine','ejs')

app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/lecturerlogin',(req,res)=>{
    res.render('lecturerlogin')
})

app.post('/lecturerlogin', async (req, res) => {
    try {
        const staffID = req.body.staffID 
        const password = req.body.password

        // Find the lecturer by Staff ID
        const lecturer = await Lecturer.findOne({ staffID: staffID });
        if (!lecturer) {
            return res.status(400).send('Invalid Staff ID or Password');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, lecturer.password);
        if (!isMatch) {
            return res.status(400).send('Invalid Staff ID or Password');
        }

        res.redirect('/lecturerdashboard');
    } catch (error) {
        console.error('Error during lecturer login:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/lecturersignup',(req,res)=>{
    res.render('lecturersignup')
})

app.post('/lecturersignup', async (req, res) => {
    try {
        const { Fullname, StaffID, Password, ConfirmPassword } = req.body;

        
        if (Password !== ConfirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        
        const newLecturer = new Lecturer({
            fullname: Fullname,
            staffID: StaffID,
            password: Password 
        });

        // Save the lecturer to the database
        await newLecturer.save();

        // Redirect to login page or send a success message
        res.redirect('/lecturerlogin');
    } catch (error) {
        console.error('Error during lecturer signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/studentlogin',(req,res)=>{
    res.render('studentlogin')
})

app.get('/studentsignup',(req,res)=>{
    res.render('studentsignup')
})

app.post('/studentsignup', async (req, res) => {
    try {
        const { Username, Password, ConfirmPassword } = req.body;

        
        if (Password !== ConfirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        
        const newStudent = new Student({
            username: Username,
            password: Password 
        });

        
        await newStudent.save();

        
        res.redirect('/studentlogin');
    } catch (error) {
        console.error('Error during student signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/readmore',(req,res)=>{
    res.render('readmore')
})

app.get('/lecturerdashboard',(req,res)=>{
    res.render('lecturerdashboard')
})

app.listen(3000, console.log('listening to request on port 3000'))
