const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn')
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')

router.get("/", (req, res)=>{
    if(req.cookies.token){
        return res.redirect('/shop')
    }
    let error = req.flash("error");
    let success = req.flash("success")
    res.render('index', {error, success, loginPage: false});
});

router.get("/shop", isLoggedIn, async (req, res)=>{
    let products = await productModel.find();
    let success = req.flash("success")
    res.render('shop', {products, success})
})

router.get("/addtocart/:productId", isLoggedIn, async (req, res)=>{
    let user = await userModel.findOne({email: req.user.email})
    user.cart.push(req.params.productId)
    await user.save()
    req.flash("success", "Product added to Cart")
    res.redirect('/shop')
})
router.get("/removefromcart/:productId", isLoggedIn, async (req, res)=>{
    let user = await userModel.findOne({email: req.user.email})
    user.cart.splice(user.cart.indexOf(req.params.productId),1)
    await user.save()
    // req.flash("success", "Product removed from Cart")
    res.redirect('/cart')
})

router.get("/cart", isLoggedIn, async (req, res)=>{
    let user = await userModel
    .findOne({email: req.user.email})
    .populate("cart");
    let totalMRP = 0;
    user.cart.forEach((val)=>{
        totalMRP = totalMRP + val.price;
    })
    res.render('cart', {user, totalMRP})
})

module.exports = router;