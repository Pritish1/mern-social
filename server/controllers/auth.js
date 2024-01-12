import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// {Register User}
export const register = async(req, res) => {   //the api uses async because we interact with mongodb in async manner
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        const randSalt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, randSalt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = newUser.save();
        res.status(201).json(savedUser);  
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const searchUser = await User.findOne({email: email});
        if(!searchUser) 
            res.status(400).json({msg : "User does not exist"});
        const authen = await bcrypt.compare(password, searchUser.password);
        if(!authen) res.status(400).json({msg : "Incorrect password !"});

        //Once the user is authenticated, we need to generate the jwt
        const token = jwt.sign({id: searchUser._id}, process.env.JWT_SECRET);
        delete searchUser.password;
        res.status(200).json({token, searchUser});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}