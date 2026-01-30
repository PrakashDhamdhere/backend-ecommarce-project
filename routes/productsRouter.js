const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn')

router.get("/", isLoggedIn, (req, res)=>{
    res.send(`Hey product\nYour Name is: ${req.user.fullname}`)
})

module.exports = router