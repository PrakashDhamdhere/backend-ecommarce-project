const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateToken = require('../utils/generateToken')

module.exports.registerUser = async (req, res)=>{
    let {email, password, fullname} = req.body;
    let user = await userModel.findOne({email})
    if(user){
        req.flash("error","User Already Exist");
        res.redirect("/")
    } else {
        bcrypt.genSalt(12, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if(err){
                    res.send(err.message);
                } else {
                    let newUser = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    })
                    req.flash("success","Account created successfully. You can now LogIn")
                    res.redirect("/")
                }
            });
        });
    }
}

module.exports.loginUser = async (req, res)=>{
    const {email, password} = req.body;
    let user = await userModel.findOne({email})
    if(user){
        bcrypt.compare(password, user.password, function(err, result) {
            if(err){
                res.send(err)
            } else {
                if(result){
                    // set the cookie
                    let token = generateToken(user)
                    res.cookie("token", token)
                    res.redirect("/shop")
                } else {
                    req.flash("error","Email or Password is Wrong")
                    res.redirect("/")
                }
            }
        });
    } else {
        // res.send("Email or Password is Wrong")
        req.flash("error","Email or Password is Wrong")
        res.redirect("/")
    }
}

module.exports.logoutUser = (req, res)=>{
    res.cookie("token", "")
    res.redirect("/")
}