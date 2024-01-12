import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Get a single user by Id - Single Read operation
export const getUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err) {
        res.status(404).json({message : err.message});
    }
}

//Get friends of a user - Multiple Read operation
export const getUserFriends = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        //using promise all because we are fetching multiple users at once.
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        //just need to return a few fields from these friends
        const customFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
              }
        );
        res.status(200).json(customFriends);

    } catch(err){
        res.status(404).json({message : err.message});
    }
}

//Toggle friend of a user - Update operation
export const addRemoveFriend = async(req, res) => {
    try{
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        //just need to return a few fields from these friends
        const customFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
              }
        );
        res.status(200).json(customFriends);
    } catch(err){
        res.status(404).json({message : err.message});
    }
}