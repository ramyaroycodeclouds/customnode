const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtkeyval = process.env.KEY;

exports.create = async (req, res, next) => {

    try 
    {
        const foundUser = await  User.findOne({ email: req.body.email });
        if (foundUser != null) {
            res.status(400).json({ status: "error", message: "user already exits", data: null });
            return false;
        }
        else
        {
            if(req.body.name=="" || req.body.email=="" || req.body.password=="" )
            {
                res.status(401).json({ status: "error", message: "Enter Name , Email and Password", data: null });
                return false;
            }
            else
            {
                let hashedPassword = await User.hashPassword(req.body.password);
                let newUser = new User({
                    name : req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                });
                let userresult = await newUser.save();
                res.json({ status: "success", message: "user created sucessfully", data:{"name":userresult.name,"email":userresult.email} });
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({status:"error",message:"Bad Request",data:null});
    }  
   next();  
};

exports.authenticate= async (req , res , next)=>{
    try
    {
        let userInfo = await User.findOne({ email:req.body.email });
        if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)==false ) {
            console.log("Invalid - User Not Found");
            res.json({ status: "error", message: "Invalid email/password!!!", data: null });
        } else { 
            const token = jwt.sign({ id: userInfo._id }, jwtkeyval, { expiresIn: '2h' });
            res.json({ status: "success", message: "user found!!!", data:{"name":userInfo.name,"email":userInfo.email, token: token } });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({status:"error",message:"Invalid Credentials",data:null});
    }  
}

// exports.checkloginuser = async (req , res , next)=>{
//     res.status(200).json({status:"success",message:"User Already Loggedin",data:null});
// }