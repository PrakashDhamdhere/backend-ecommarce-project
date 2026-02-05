const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner-model')

module.exports = async (req, res, next)=>{
    if(!req.cookies.token2){
        req.flash("error", "you need to login first")
        return res.redirect("/owners/login")
    }

    try {
        let decoded = jwt.verify(req.cookies.token2, process.env.JWT_KEY);
        let owner = await ownerModel
        .findOne({email: decoded.email})
        .select("-password");
        req.owner = owner;
        next();
    } catch (error) {
        res.flash("error","something went wrong.")
        res.redirect("/owners/login")
    }
}