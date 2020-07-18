const express = require('express');
const router =  express.Router();

const { 
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
 } = require('../controllers/bootcamps');

 // Include other resource routers
 const courseRouter = require('./courses');

 // Re-route to other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps)
                 .post(createBootcamp);

router.route('/:id').get(getBootcamp)
                    .put(updateBootcamp)
                    .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);                    

module.exports = router;