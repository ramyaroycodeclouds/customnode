const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
var path = require('path');
const mongoose = require('mongoose');
var ejs = require('ejs');

const app = express();
// BODY PARSER
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

// ROUTES
const index = require('./routes/index');
app.use('/', index);

// app.use('/users', users);
// app.use('/checkloginuser', authenticateToken,users);
// app.use('/entertainment' , authenticateToken, movies);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}); 
 
// CUSTOM ERROR FUNCTION
app.use((err, request, res, next) => {
    console.error(err);
    res.status(500).send('Something is broken!');
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.CONNECTION_URI}`, {
      useNewUrlParser: true,
      dbName: 'custommongodb',
    });
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
connectDB();

// LISTEN FOR REQUESTS
app.listen(process.env.PORT,() => {
    console.log('Listening on Port ' + process.env.PORT);
});