const express = require('express');
const galleries = express.Router();
const galleryController = require('../controllers/galleryController');

 
galleries.get('/galleries/:searchType?/:searchValue?/:key?', galleryController.getByTitle);

 

module.exports = galleries;