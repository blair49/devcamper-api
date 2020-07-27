const express = require('express');
const router =  express.Router();

const { 
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
 } = require('../controllers/bootcamps');

 // Include other resource routers
 const courseRouter = require('./courses');

const Bootcamp = require('../models/Bootcamp');
 const advancedQuery = require('../middleware/advancedQuery');

 // Re-route to other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedQuery(Bootcamp, 'courses'), getBootcamps)
                 .post(createBootcamp);

router.route('/:id').get(getBootcamp)
                    .put(updateBootcamp)
                    .delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);                    

module.exports = router;