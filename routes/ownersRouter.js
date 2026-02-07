const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model')
const productModel = require('../models/product-model')
const generateToken = require('../utils/generateToken');
const isOwnerLogin = require('../middlewares/isOwnerLogin');

if(process.env.NODE_ENV === "development"){
    router.post("/create", async (req, res)=>{
        let owners = await ownerModel.find()
        if(owners.length > 0){
            res.status(503).send("You don't have permssion to create more than one owners")
        } else {
            let {fullname, email, password} = req.body;

            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password,
            })
            res.send(createdOwner)
        }

        
    })
}


router.get("/admin", isOwnerLogin, async (req, res)=>{
    let products = await productModel.find();
    let success = req.flash("success")
    let error = req.flash("error")
    res.render('admin', {products, success, error})
})

router.get("/login", (req, res)=>{
    let error = req.flash("error")
    res.render('owner-login', {error, loginPage: true})
})

router.get("/logout", (req, res)=>{
    res.cookie("token2","")
    res.redirect('/owners/login')
})

router.post("/login", async (req, res)=>{
    const {email, password} = req.body
    const owner = await ownerModel.findOne({email})
    if(!owner){
        req.flash("error","Wrong email and password");
        return res.redirect("/owners/login")
    }
    if(owner.password !== password){
        req.flash("error","Wrong email and password");
        return res.redirect("/owners/login")
    }
    req.flash("success", "Admin Login Successfull")
    const token = generateToken(owner)
    res.cookie("token2", token);
    res.redirect('/owners/admin');
})

router.get("/createProducts", isOwnerLogin, (req, res)=>{
    let success = req.flash("success")
    res.render('createproducts', {success})
})

router.get('/deleteProduct/:id', isOwnerLogin, async (req, res)=>{
    let deletedProduct = await productModel.findOneAndDelete({_id: req.params.id});
    req.flash("error", `${deletedProduct.name} Deleted`);
    res.redirect("/owners/admin");
})



module.exports = router