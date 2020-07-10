const experess = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env variables
dotenv.config({path: './config/config.env'});

//connect to database
connectDB();

//route files
const bootcamps = require('./routes/bootcamps');

const app = experess();

app.use(experess.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));

});