const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model')

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

router.get("/", (req, res)=>{
    res.send("Hey owner")
})

module.exports = router