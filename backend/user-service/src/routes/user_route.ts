import express from "express";
import {getUserProfile, login, myProfile, updateProfilePic, updateUser} from "../controllers/user_controller.js";
import { isAuth } from "../middleware/user_auth.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();

router.post("/login", login);
router.get("/myprofile", isAuth, myProfile);
router.get("/getuser/:id", getUserProfile);
router.put("/update", isAuth, updateUser);
router.put("/update/pfp", isAuth, uploadFile, updateProfilePic);

export default router;

