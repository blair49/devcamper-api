const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');


//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    let query;
    // Create copy of request query
    const reqQuery = {...req.query};
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from query
    removeFields.forEach(param => delete reqQuery[param]);

    //Crate query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators like {$gt, $gte etc}
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    
    // Find resource
    query = Bootcamp.find(JSON.parse(queryStr));
    
    // Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort based on fields
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else{
        query = query.sort('-createdOn');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute request
    const bootcamps = await query;
    
    //Pagination results
    const pagination = {};
    if(startIndex>0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    if(endIndex<total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    res.status(200).json({
        status: 'success',
        count: bootcamps.length,
        pagination,
        data: bootcamps
    });
    
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
  
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    
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
