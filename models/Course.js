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

//Static method to get average of course fees
CourseSchema.statics.getAverageCost = async function(bootcampId){
    const obj = await this.aggregate([
        {
            $match: {bootcamp:bootcampId}
        },
        {
            $group: {
                _id:'$bootcamp',
                averageCost: {$avg: '$fees'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch (err) {
        console.error(err);
    }

};

//Call getAverageCost after save
CourseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
});

//Call getAverageCost before remove
CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);