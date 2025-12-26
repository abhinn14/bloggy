import express from "express";
import { addComment, deleteComment, getAllBlogs, getAllComments, getSavedBlog, getSingleBlog, saveBlog } from "../controllers/blog_controller.js";
import { isAuth } from "../middlewares/blog_auth.js";

const router = express.Router();

router.get("/all", getAllBlogs);
router.get("/:id", getSingleBlog);
router.post("/comment/:id", isAuth, addComment);
router.get("/comment/:id", getAllComments);
router.delete("/comment/:commentid", isAuth, deleteComment);
router.post("/save/:blogid", isAuth, saveBlog);
router.get("/saved/all", isAuth, getSavedBlog);

export default router;