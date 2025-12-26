"use client";
import {PageLoading} from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  author_service,
  Blog,
  blog_service,
  useAppData,
  User,
} from "@/context/AppContext";
import axios from "axios";
import {
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Trash2Icon,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  userid: string;
  comment: string;
  create_at: string;
  username: string;
}

const BlogPage = () => {
  const { isAuth, user, fetchBlogs, savedBlogs, getSavedBlogs } = useAppData();
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);

  async function fetchComment() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${blog_service}/api/blog/comment/${id}`);
      setComments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComment();
  }, [id]);

  const [comment, setComment] = useState("");

  async function addComment() {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${blog_service}/api/blog/comment/${id}`,
        {comment},
        {headers: {Authorization: `Bearer ${token}`}}
      );
      toast.success(data.message);
      setComment("");
      fetchComment();
    } catch (error) {
      toast.error("Problem while adding comment");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSingleBlog() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${blog_service}/api/blog/${id}`);
      setBlog(data.blog);
      setAuthor(data.author);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const deleteComment = async (id: string) => {
    if(confirm("Are you sure you want to delete this comment?")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete(
          `${blog_service}/api/blog/comment/${id}`,
          {headers: {Authorization: `Bearer ${token}`}}
        );
        toast.success(data.message);
        fetchComment();
      } catch (error) {
        toast.error("Problem while deleting comment");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  async function deleteBlog() {
    if(confirm("Are you sure you want to delete this blog")) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.delete(
          `${author_service}/api/blog/delete/${id}`,
          {headers: {Authorization: `Bearer ${token}`}}
        );
        toast.success(data.message);
        router.push("/");
        setTimeout(() => {
          fetchBlogs();
        }, 4000);
      } catch (error) {
        toast.error("Problem while deleting comment");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if(savedBlogs && savedBlogs.some((b) => b.blogid === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedBlogs, id]);

  async function saveBlog() {
    const token = Cookies.get("token");
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${blog_service}/api/blog/save/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      setSaved(!saved);
      getSavedBlogs();
    } catch (error) {
      toast.error("Problem while saving blog");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSingleBlog();
  }, [id]);

  if(!blog) {
    return <PageLoading />;
  }

return (
  <div className="max-w-4xl mx-auto px-4 py-16 space-y-16 text-zinc-100">
    {/* BLOG */}
    <Card className="bg-zinc-900 border-zinc-800 mt-6">
      <CardHeader className="space-y-6 pb-10">
        <h1 className="text-3xl font-bold text-orange-500 leading-snug">
          {blog.title}
        </h1>

        {/* AUTHOR + ACTIONS */}
        <div className="flex items-center justify-between flex-wrap gap-6">
          <Link
            href={
              blog.author === user?._id
                ? "/profile"
                : `/profile/${author?._id}`
            }
            className="flex items-center gap-3 text-zinc-300 hover:text-orange-400 transition-colors"
          >
            <img
              src={author?.image}
              alt=""
              className="w-10 h-10 rounded-full border border-zinc-700 object-cover"
            />
            <span className="text-sm font-medium">{author?.name}</span>
          </Link>

          <div className="flex items-center gap-1">
              {/* SAVE */}
              {isAuth && (
                <Button asChild size="icon">
                  <button
                    onClick={saveBlog}
                    disabled={loading}
                    className="
                      h-8 w-8 rounded-md
                      flex items-center justify-center
                      text-orange-500
                      hover:text-orange-600
                      hover:bg-orange-500/15
                      focus-visible:ring-2
                      focus-visible:ring-orange-500/40
                      active:scale-95
                      transition-all
                      disabled:opacity-50
                      cursor-pointer
                    "
                  >
                    {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </Button>
              )}

              {/* EDIT */}
              {blog.author === user?._id && (
                <Button asChild size="icon">
                  <button
                    onClick={() => router.push(`/blogs/edit/${id}`)}
                    className="
                      h-8 w-8 rounded-md
                      flex items-center justify-center
                      text-orange-500
                      hover:text-orange-600
                      hover:bg-orange-500/15
                      focus-visible:ring-2
                      focus-visible:ring-orange-500/40
                      active:scale-95
                      transition-all
                      cursor-pointer
                    "
                  >
                    <Edit size={16} />
                  </button>
                </Button>
              )}

              {/* DELETE */}
              {blog.author === user?._id && (
                <Button asChild size="icon">
                  <button
                    onClick={deleteBlog}
                    disabled={loading}
                    className="
                      h-8 w-8 rounded-md
                      flex items-center justify-center
                      text-red-500
                      hover:text-red-600
                      hover:bg-red-500/15
                      focus-visible:ring-2
                      focus-visible:ring-red-500/40
                      active:scale-95
                      transition-all
                      disabled:opacity-50
                      cursor-pointer
                    "
                  >
                    <Trash2Icon size={16} />
                  </button>
                </Button>
              )}
            </div>


        </div>
      </CardHeader>

      <CardContent className="space-y-16 pb-16">
        {/* IMAGE */}
        <div className="flex justify-center">
          <div className="w-72 h-72 rounded-2xl border border-zinc-800 bg-zinc-800/40 flex items-center justify-center">
            <img
              src={blog.image}
              alt=""
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-6 text-zinc-400 text-base max-w-3xl mx-auto leading-relaxed mb-6">
          {blog.description}
        </p>

        {/* CONTENT */}
        <div
          className="prose prose-invert prose-orange max-w-3xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
        />
      </CardContent>
    </Card>

    {/* COMMENTS */}
    <Card className="bg-zinc-900 border-zinc-800 mt-6">
      <CardHeader className="pb-8">
        <h3 className="text-lg font-semibold text-orange-400">
          Comments ({comments.length})
        </h3>
      </CardHeader>

      <CardContent className="space-y-12 pb-12">
        {/* ADD COMMENT */}
        {isAuth && (
          <div className="flex gap-4 mb-4">
            <User2 size={24} />

            <div className="flex-1 flex items-end gap-4">
              {/* INPUT */}
              <Input
                placeholder="Write a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 bg-transparent border-0 border-b border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-orange-500 text-sm"
              />

              {/* SEND BUTTON */}
              <Button
                size="icon"
                onClick={addComment}
                disabled={loading || !comment.trim()}
                className="
                  bg-orange-500 text-black
                  hover:bg-orange-600
                  active:scale-95
                  disabled:opacity-50
                  transition
                  cursor-pointer
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M22 2L11 13"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        )}

        {/* COMMENT LIST */}
        {comments.length > 0 ? (
  <div className="space-y-8">
    {comments.map((e) => (
      <div
        key={e.id}
        className="
          group
          flex gap-4
          pb-6
          border-b border-zinc-800
          last:border-b-0
        "
      >
        {/* USER AVATAR */}
        <div
          className="
            mt-1
            h-10 w-10
            shrink-0
            rounded-full
            bg-zinc-800
            flex items-center justify-center
            text-zinc-400
          "
        >
          <User2 size={16} />
        </div>

        {/* COMMENT CONTENT */}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-orange-400">
            {e.username}
          </p>

          <p className="text-sm leading-relaxed text-zinc-200">
            {e.comment}
          </p>

          <p className="text-xs text-zinc-500">
            {new Date(e.create_at).toLocaleString()}
          </p>
        </div>

        {/* DELETE ACTION */}
        {e.userid === user?._id && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteComment(e.id)}
            disabled={loading}
            className="
              h-8 w-8
              shrink-0
              rounded-full
              text-zinc-500
              hover:bg-red-500/10
              hover:text-red-500
              transition
              cursor-pointer
            "
          >
            <Trash2 size={15} />
          </Button>
        )}
      </div>
    ))}
  </div>
) : (
  <p className="text-sm text-zinc-500">No comments yet.</p>
)}

      </CardContent>
    </Card>
  </div>
);
}
export default BlogPage;