const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
 
const users = require('./routes/users');
const authenticateToken = require('./middleware/authenticateToken');
const galleries = require('./routes/galleries'); 

// BODY PARSER
app.use(bodyParser.json());

// ROUTES
app.get('/', (req, res) => {
  //res.send('Welcome to my Movie API!')
});
 
app.use('/users', users);
app.use('/checkloginuser', authenticateToken,users);
app.use('/entertainment' , authenticateToken, galleries);

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
// app.use((err, request, res, next) => {
//     console.error(err);
//     res.status(500).send('Something is broken!');
// });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.CONNECTION_URI}`, {
      useNewUrlParser: true,
      dbName: 'customnodedb',
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
