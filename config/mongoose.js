const mongoose = require('mongoose');

//connection to database
mongoose.connect('mongodb://127.0.0.1/codeial_dev');
mongoose.set('strictQuery',false);

const db = mongoose.connection;

//if there is error in connecting to database

//console.error displays console.log like an error
db.on('error', console.error.bind(console,"Error connecting to MongoDB"));

//if its connecting to DB
db.once('open', function(){
    console.log('Connected to Database :: MongoDB')
});

//to make this file usable we need to export it
module.exports = db;

//now we need to place it in index.js of app