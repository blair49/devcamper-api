const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description:{
        type: String,
        required: [true, 'Please add a course description']
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration of course in days']
    },
    fees:{
        type: Number,
        required: [true, 'Please add course fees']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minumum skill required'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);