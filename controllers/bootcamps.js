const Bootcamp = require('../models/Bootcamp');
//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({status:"success", msg:"Get all bootcamps"});
}

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({status:"success", msg:`Get bootcamp ${req.params.id}`});
}

//@desc Create a bootcamp
//@route POST /api/v1/bootcamps
//@access Private
exports.createBootcamp = async (req, res, next) => {
    
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            status:'success',
            data: bootcamp
        });
    } catch (error) {
        res.status(400).json({
            status:'error'
        })
    }

    

};

//@desc Update a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({status:"success", msg:`Update bootcamp ${req.params.id}`});
}

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({status:"success", msg:`Delete bootcamp ${req.params.id}`});
}