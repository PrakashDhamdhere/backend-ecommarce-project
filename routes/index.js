const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn')
const productModel = require('../models/product-model')

router.get("/", (req, res)=>{
    let error = req.flash("error");
    let success = req.flash("success")
    res.render('index', {error, success, loginPage: false});
});

router.get("/shop", isLoggedIn, async (req, res)=>{
    let products = await productModel.find();
    res.render('shop', {products})
})

router.get("/cart", (req, res)=>{
    res.render('cart')
})

router.get("/addtocart/:id", isLoggedIn, async (req, res)=>{
    let products = await productModel.find();
    res.render('shop', {products})
})

module.exports = router;