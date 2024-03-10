const express = require('express');
const users = express.Router();
const userController = require('../controllers/userController');

// users.get('/', userController.checkloginuser);

users.get('/', function(req, res, next) {
    res.render('frontend/home', { error: false });
  });
users.post('/register', userController.create);
users.post('/login', userController.authenticate);
module.exports = users;  