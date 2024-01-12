import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read routes
// get all posts in the db
router.get("/", verifyToken, getFeedPosts);
// get posts of a particular user
router.get("/:userId/posts", verifyToken, getUserPosts);

// Update routes
router.patch("/:id/like", verifyToken, likePost);

export default router;