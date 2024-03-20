const User = require('../models/users');
const { validationResult } = require("express-validator");

const { verify } = require('../middleware/authenticateToken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const jwtkeyval = process.env.KEY;

/*
// crypto module
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);
// secret key generates 32 bytes of random data
const securityKey = crypto.randomBytes(32);
//The cipher function
const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
//Encrypt the message
*/

/**
 * Accepting User Registration 
 * @returns 
 */
exports.registration = async (req, res, next) => {
    try {

        if (req.body.name == "" || req.body.email == "" || req.body.password == "") {
            res.status(400).json({ status: "error", message: "Enter Name , Email and Password", data: {} });
            return false;
        }

        const errors = validationResult(req);
        // if there is error then return Error
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: "Error Encountered",
                data: { errorlist: errors.array() },
            });
        }
        else {

            const foundUser = await User.findOne({ email: req.body.email });
            if (foundUser != null) {
                let errors = [
                    {
                        "type": "field",
                        "value": req.body.email,
                        "msg": "Email Already Exists",
                        "path": "email",
                        "location": "body"
                    }
                ];

                res.status(406).json({ status: "error", message: "user already exits", data: { errorlist: errors } });
                return false;
            }

             let hashedPassword = await User.hashPassword(req.body.password);
            // let encryptedphone = cipher.update(req.body.phone, "utf-8", "hex");
            // encryptedphone += cipher.final("hex");

            // let encryptedemail = cipher.update(req.body.email, "utf-8", "hex");
            // encryptedemail += cipher.final("hex");

            let newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                customlink: req.body.firstname.substr(1, 1) + "_" + req.body.lastname.substr(1) + "_" + Math.floor((Math.random() * 1000) + 1),
                is_validemail: false,
                password: hashedPassword,
                phone: "",
                updated_at: "",
                login_at: ""
            });
            let userresult = await newUser.save();
            res.json({ status: "success", message: "user created sucessfully", data: { "id": userresult.id, "name": userresult.firstname + " " + userresult.lastname, "email": userresult.email } });
        }

    } catch (error) {
        console.log(error);
        next(error);
        //res.status(400).json({ status: "error", message: "Bad Request", data: {} });
    }
    next();
};


exports.login = async (req, res, next) => {
    try {
        let userInfo = await User.findOne({ email: req.body.email });
        if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password) == false) {
            console.log("Invalid - User Not Found");
            res.status(404).json({ status: "error", message: "Invalid email/password", data: {} });
        } else {
            const token = jwt.sign({ id: userInfo._id }, jwtkeyval, { expiresIn: '4h' });
            res.status(200).json({ status: "success", message: "Successfully Login", data: { "firstname": userInfo.firstname, "lastname": userInfo.lastname, "email": userInfo.email, "token": token   } });
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ status: "error", message: "Invalid Credentials", data: {} });
    }
}

exports.checkloginuser = async (req , res )=>{
    //    res.status(200).json({status:"success",message:"",data:{}});
     let token = authHeader = "";
    console.log(req.headers.authorization);
    
    authHeader = String(req.headers.authorization || '');

    if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
    }  

    if(token=='' || token == undefined || token == null)
    {
        res.status(400).json({ status: "error", message: "Token not found", data: {} });
        return false;
    }

    if(token){
        // Verify the token using jwt.verify method
        const decode = jwt.verify(token, jwtkeyval);
        res.json({ status: "success", message: "Login True", data: decode });
    }else{
        // Return response with error
        res.status(404).json({status: "success", message: "Login false", data: {} });
    }
}

/*
module.exports = {
    create: function (req, res, next) {
        User.findOne({ email: req.body.email })
            .then((foundUser) => {
                    if (foundUser != null) {
                        res.status(400).json({ status: "error", message: "user already exits", data: {} });
                        return false;
                    }
                    else {
                        if(req.body.name=="" || req.body.email=="" || req.body.password=="" )
                        {
                            res.status(401).json({ status: "error", message: "Enter Name , Email and Password", data: {} });
                            return false;
                        }
                        
                        let hashedPassword = User.hashPassword(req.body.password);

                        const newUser = new User({
                            name : req.body.name,
                            email: req.body.email,
                            password: hashedPassword
                        });

                        newUser.save().then((userresult) => {
                            
                            res.json({ status: "success", message: "user created sucessfully", data:{"name":userresult.name,"email":userresult.email} });
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                
            })
            .catch((error) => {
                //When there are errors We handle them here
                console.log(error);
                res.status(400).json({status:"error",message:"Bad Request",data:null});
            }); 
            return next();
        },
    authenticate: function (req, res, next) {
    
         
        const passval = req.body.password;

        User.findOne({ email:req.body.email })
        .then((userInfo) => {
            if (userInfo != null && bcrypt.compareSync(passval, userInfo.password)==false ) {
                console.log("Invalid - User Not Found");
                res.json({ status: "error", message: "Invalid email/password!!!", data: {} });
            } else { 
                const token = jwt.sign({ id: userInfo._id }, jwtkeyval, { expiresIn: '24h' });
                res.json({ status: "success", message: "user found!!!", data:{"name":userInfo.name,"email":userInfo.email, token: token } });
            }
        })
        .catch((error) => {
            //When there are errors We handle them here
            console.log("Error");
            console.log(error);
            res.status(400).json({status:"error",message:"Invalid Credentials",data:null});
        }); 
    },
     
}	
*/