import express from "express";
import {createBlog, deleteBlog, updateBlog} from "../controllers/author_controller.js";
import {isAuth} from "../middlewares/author_auth.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/create", isAuth, uploadFile, createBlog);
router.put("/update/:id", isAuth, uploadFile, updateBlog);
router.delete("/delete/:id", isAuth, deleteBlog);

export default router;