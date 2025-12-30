"use client";

import { PageLoading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Blog,
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);


  const fetchSingleBlog = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/blog/${id}`);
      setBlog(data.blog);
      setAuthor(data.author);
    } finally {
      setLoading(false);
    }
  };

  const fetchComment = async () => {
    try {
      const { data } = await axios.get(
        `/api/blog/comment/${id}`
      );
      setComments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSingleBlog();
    fetchComment();
  }, [id]);

  useEffect(() => {
    setSaved(!!savedBlogs?.some((b) => b.blogid === id));
  }, [savedBlogs, id]);


  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `/api/blog/comment/${id}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setComment("");
      fetchComment();
    } catch {
      toast.error("Problem while adding comment");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.delete(
        "/api/blog/comment/${commentId}",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchComment();
    } catch {
      toast.error("Problem while deleting comment");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async () => {
    if (!confirm("Delete this blog?")) return;

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.delete(
        `/api/blog/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      router.push("/");
      fetchBlogs();
    } catch {
      toast.error("Problem while deleting blog");
    } finally {
      setLoading(false);
    }
  };

  const saveBlog = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `/api/blog/save/${id}`,
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
    } catch {
      toast.error("Problem while saving blog");
    } finally {
      setLoading(false);
    }
  };

  if (!blog) return <PageLoading />;


  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16 text-zinc-900">
      {/* BLOG */}
      <Card className="bg-white border border-zinc-200">
        <CardHeader className="space-y-6 pb-10">
          <h1 className="text-3xl font-bold text-orange-500">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <Link
              href={
                blog.author === user?._id
                  ? "/profile"
                  : `/profile/${author?._id}`
              }
              className="flex items-center gap-3 text-zinc-700 hover:text-orange-500"
            >
              <img
                src={author?.image}
                className="w-10 h-10 rounded-full border border-zinc-200"
                alt=""
              />
              <span className="text-sm font-medium">{author?.name}</span>
            </Link>

            <div className="flex gap-1">
              {isAuth && (
                <Button className="cursor-pointer"
                  size="icon"
                  variant="ghost"
                  onClick={saveBlog}
                  disabled={loading}
                >
                  {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </Button>
              )}

              {blog.author === user?._id && (
                <Button className="cursor-pointer"
                  size="icon"
                  variant="ghost"
                  onClick={() => router.push(`/blogs/edit/${id}`)}
                >
                  <Edit size={16} />
                </Button>
              )}

              {blog.author === user?._id && (
                <Button className="cursor-pointer"
                  size="icon"
                  variant="ghost"
                  onClick={deleteBlog}
                  disabled={loading}
                >
                  <Trash2Icon size={16} className="text-red-500" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-16 pb-16">
          {/* IMAGE */}
          <div className="flex justify-center">
            <img
              src={blog.image}
              alt=""
              className="w-full max-w-md rounded-xl border border-zinc-200 object-contain"
            />
          </div>

          <p className="text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            {blog.description}
          </p>

          <div
            className="prose prose-orange max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
          />
        </CardContent>
      </Card>

      {/* COMMENTS */}
      <Card className="bg-white border border-zinc-200">
        <CardHeader>
          <h3 className="font-semibold text-orange-500">
            Comments ({comments.length})
          </h3>
        </CardHeader>

        <CardContent className="space-y-8">
          {isAuth && (
            <div className="flex gap-3">
              <User2 />
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <Button
                onClick={addComment}
                disabled={loading || !comment.trim()}
                className="cursor-pointer text-orange-500"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          )}

          {comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 border-b pb-4 last:border-none"
            >
              <User2 size={18} />
              <div className="flex-1">
                <Link href={`/profile/${c.userid}`}>
                  <p className="font-semibold text-orange-500 hover:underline cursor-pointer">
                    {c.username}
                  </p>
                </Link>
                <p className="text-zinc-800">{c.comment}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(c.create_at).toLocaleString()}
                </p>
              </div>

              {c.userid === user?._id && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteComment(c.id)}
                  disabled={loading}
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;
