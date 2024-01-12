// using type : module in package.json, we can use import statements instead of require statements
import express from "express";
import dotenv from "dotenv";            //for environment variables
import bodyParser from "body-parser";   //to process the request body
import helmet from "helmet";            //for request safety
import cors from "cors";                //for cross-origin requests
import morgan from "morgan";            //for logging
import multer from "multer";            //local file upload
import path from "path";
import mongoose from "mongoose";        //for mongodb access
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";


/* MIDDLEWARE CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit : "30mb", extended : true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE CONFIGURATIONS */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/public/assets')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage })

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
//Here the upload single is the middleware and the register is a controller where we actually add the user details to the db
//Controllers store the logic behind the endpoint
//Ideally this register route must go in the /routes/auth but we need the upload object which is present here.
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
/* MONGO SETUP */ 
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser : true
}).then(() => {
  app.listen(PORT, () => console.log(`Server port ${PORT}`));
  //Base data load just one time
  // User.insertMany(users);
  // Post.insertMany(posts);
}).catch((error) => {console.log(`Error connecting to mongodb, ${error}`)});

