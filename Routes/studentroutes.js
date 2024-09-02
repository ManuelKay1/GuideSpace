const express = require('express')

const router = express.Router()

const Student = require('../models/Student');

router.get('/studentlogin',(req,res)=>{
    res.render('studentlogin')
})


router.post('/studentlogin', async (req, res) => {
    try {
        const { Username, Password } = req.body;

        
        const student = await Student.findOne({ username: Username.trim() });
        if (!student) {
            return res.status(400).send('Invalid Username or Password');
        }

        
        const isMatch = await bcrypt.compare(Password, student.password);
        if (!isMatch) {
            return res.status(400).send('Invalid Username or Password');
        }

        
        res.redirect('/studentdashboard');
    } catch (error) {
        console.error('Error during student login:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/studentsignup',(req,res)=>{
    res.render('studentsignup')
})

router.post('/studentsignup', async (req, res) => {
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

router.get('/studentdashboard',(req,res)=>{
    res.render('studentdashboard')
})

module.exports=router;