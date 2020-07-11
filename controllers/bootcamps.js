const Bootcamp = require('../models/Bootcamp');
//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            status: 'success',
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (error) {
        res.status(400).json({status:'error'});
    }
    
}

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
             return res.status(400).json({status:'error'});
        }
        
        res.status(200).json({
            status:'success',
            data: bootcamp
        });
        
    } catch (error) {
        res.status(400).json({status:'error'});
    }
    
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
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!bootcamp){
            return res.status(400).json({status:'error'});
        }
        
        res.status(200).json({status:'success', data: bootcamp});

    } catch (error) {
        res.status(400).json({status:'error'});
    }
    
}

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return res.status(400).json({status:'error'});
        }
        
        res.status(200).json({status:'success', data: {}});

    } catch (error) {
        res.status(400).json({status:'error'});
    }
};