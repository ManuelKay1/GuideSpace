const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const LecturerSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    staffID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Pre-save hook to hash the password before saving
LecturerSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


const Lecturer = mongoose.model('Lecturer', LecturerSchema);
module.exports = Lecturer;
