const { populate } = require("../models/Bootcamp");

const advancedQuery = (model, populate) => async(req, res, next) =>{
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
    query = model.find(JSON.parse(queryStr));
    
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
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate);
    }
    

    // Execute request
    const results = await query;
    
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

    res.advancedResults = {
        status: 'success',
        count: results.length,
        pagination,
        data: results
    }

    next();

};

module.exports = advancedQuery;