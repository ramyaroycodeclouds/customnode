const mongoose = require("mongoose");
 
let gallerySchema = mongoose.Schema({
    userid: {type: Object},
    title: {type: String},
    description: {type: String},
    gallery_image: {type: String},
    gallery_alt_name: {type: String},
    is_sale: {type: Boolean},
    price: { type:mongoose.Types.Decimal128 },
    
});


module.exports = mongoose.model(
    'Gallery', gallerySchema, 'Gallery');