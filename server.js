const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
// Load env variables
dotenv.config({path: './config/config.env'});

//connect to database
connectDB();

//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const fileUpload = require('express-fileupload');

const app = express();

//Body parser
app.use(express.json());

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//File upload middleware
app.use(fileUpload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));

});