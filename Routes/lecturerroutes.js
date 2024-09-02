const express = require('express');
const bcrypt = require('bcrypt');
const Lecturer = require('../models/Lecturer'); // Ensure path is correct

const Lroutes = express.Router();

Lroutes.get('/lecturerlogin', (req, res) => {
    res.render('lecturerlogin');
});

Lroutes.post('/lecturerlogin', async (req, res) => {
    try {
        const staffID = req.body.staffID.trim(); // Ensure proper input handling
        const password = req.body.password;

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

Lroutes.get('/lecturersignup', (req, res) => {
    res.render('lecturersignup');
});

Lroutes.post('/lecturersignup', async (req, res) => {
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

        res.redirect('/lecturerlogin');
    } catch (error) {
        console.error('Error during lecturer signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

Lroutes.get('/lecturerdashboard', (req, res) => {
    res.render('lecturerdashboard');
});

module.exports = Lroutes;
