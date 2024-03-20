const express = require('express');
const users = express.Router();
const userController = require('../controllers/userController');

const {userDataValidateChainMethod,} = require("../middleware/user_registration.validation");


users.get('/', userController.checkloginuser);
users.post('/register', userDataValidateChainMethod, userController.registration);
users.post('/login', userController.login);


module.exports = users;