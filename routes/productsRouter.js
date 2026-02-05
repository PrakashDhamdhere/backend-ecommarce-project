const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn')
const upload = require('../config/multer-config')
const productModel = require('../models/product-model')

router.get("/", isLoggedIn, (req, res)=>{
    res.send(`Hey product\nYour Name is: ${req.user.fullname}`)
})

router.post("/create", upload.single('image'), async (req, res)=>{
    try {
        let {name, price, discount, bgcolor, panelcolor, textcolor} = req.body;
        function addHashIfNotExists(str) {
            if (!str.startsWith("#")) {
                return "#" + str;
            }
            return str;
        }
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor: addHashIfNotExists(bgcolor),
            panelcolor:addHashIfNotExists(panelcolor),
            textcolor: addHashIfNotExists(textcolor)
        })
        req.flash("success", "Product Created Successfully.")
        res.redirect("/owners/admin")
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router