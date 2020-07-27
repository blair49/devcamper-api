const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        status:'success',
        data: bootcamp
    });
        
    
});

//@desc Create a bootcamp
//@route POST /api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        status:'success',
        data: bootcamp
    });
});

//@desc Update a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({status:'success', data: bootcamp});
});

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    
    bootcamp.remove();

    res.status(200).json({status:'success', data: {}});
});

//@desc Get bootcamps within a certain radius of a zipcode
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
//@access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance, unit} = req.params;

    //Get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const long = loc[0].longitude;

    //Calculate radius in radians
    //Divide distance by radius of Earth
    //Radius of Earth R = 3,963 mi or 6,378 km
    let R = null;
    let radius = null;
    let bootcamps = [];
    if(unit === 'mi'){
        R = 3963;
    } else if(unit === 'km'){
        R = 6378;
    }
    if(R != null){
       radius = distance/R;
    }
    if(radius!=null){
        bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[long, lat], radius]}}
        });
    }

    res.status(200).json({
        status: 'success',
        count: bootcamps.length,
        data: bootcamps
    });

});

//@desc Upload photo for a bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    
    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;
    
    //Make sure that the file is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400));
    }

    //Check file size
    if(file.size > process.env.MAX_UPLOAD_FILE_SIZE){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_UPLOAD_FILE_SIZE} bytes`, 400));
    }

    //Create custom unique file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
        if(err){
            return next(new ErrorResponse('Error occured while uploading file', 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name});

        res.status(200).json({
            status: 'success',
            data: file.name
        });
    });

});
