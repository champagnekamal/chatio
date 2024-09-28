const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Schema/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.use(express.json());

const login = router.post('/login',async(req,res)=>{
try {

    const {email,password} = req?.body;
    if(!email || !password){
        return res.status(400).json({error:"please fill all the fields"})
    }
    const existingUser = await User.findOne({email});

    if(!existingUser){
        return res.status(400).json({error:"User does not exist"})
    }
    else{
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect){
            return res.status(401).json({error:"Invalid credentials"})
        }
        else{

            const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET,{expiresIn:"1h"})
            res.status(200).json({statusCode:200,status:'success',data:{email:existingUser?.email,name:existingUser?.name,token} })
        }
    }
} catch (error) {
    res.status(500).json({error:"Internal Server Error"})
}
})

module.exports = login;