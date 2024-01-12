import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();
//using router, instead of using app.post, we can use router.post. As this router is exported as authRouter, its actual route will be /auth/login
router.post("/login", login);

export default router;