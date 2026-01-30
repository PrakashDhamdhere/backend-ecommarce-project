const express = require('express');
const router = express.Router();
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registerUser, loginUser, logoutUser } = require('../controllers/authController')

// router.get("/", (req, res)=>{
//     res.send("Hey user")
// })

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)



module.exports = router