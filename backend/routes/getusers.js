const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Schema/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

const getuser = router.get('/getuser',async(req,res)=>{
    try {
      
          // Token is valid, user is logged in
          const users = await User.find().select('-password  -__v');
          res.json(users);
        
      } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
})

module.exports = getuser