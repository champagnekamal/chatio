const express = require('express');
const router = express.Router();
const user = require('../Schema/User')
const bcrypt = require('bcryptjs');


router.use(express.json());

const register = router.post('/register',async(req,res)=>{
    try {
        console.log(req?.body)
        const {name,email,password,role} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({error:"please fill all the fields"})
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new user({
            name,
            email,
            password: hashedPassword,
            role,
          });
          await newUser.save();

          res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = register;