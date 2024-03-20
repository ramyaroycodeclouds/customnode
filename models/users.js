const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const schemaOptions = {
//     timestamps: { createdAt: 'created_at',updatedAt:"updated_at" }
//   };
  
let userSchema = mongoose.Schema({
    firstname: {type: String, required: true,max:40},
    lastname: {type: String, required: true,max:40},
    customlink: {type: String, required: false},
    profile_pic: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: true},
    is_validemail: {type: Boolean, required: false},
	password: {type: String, required: true},
    dob:{type: Date,required: false,trim: true},
    is_login:{type:Boolean},
    gender: {type: String,enum : ['m','f','o','na'],default: 'na'},
    role: {type: String,enum : ['sad','ad','ar','cu'],default: 'cu'},
    address: {type: String, required: false, max: 100},
    address1: {type: String, required: false, max: 200},
    city: {type: String, required: false, max: 200},
    state: {type: String, required: false, max: 200},
    province: {type: String, required: false, max: 400},
    zipcode: {type: Number, required: false, max: 10},
    country: {type: String, required: false, max: 100},
    created_at: {type: Date, default: Date.now },
    updated_at: {type: Date },
    login_at: {type: Date }
});


userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 11);
};

/**
 * Using For Login 
 * 
 * ***/
userSchema.methods.validatePassword = function (password)
{
    return bcrypt.compareSync(password, this.Password);
};


// // You could then check if a user's password is valid like so:
// UserModel.findOne({ email: 'email@gmail.com' }, function(err, user) {
//     if (user.checkPassword('secretPassword')) {
//         // ... user is legit
//     }
// });

module.exports = mongoose.model('User', userSchema, 'User');