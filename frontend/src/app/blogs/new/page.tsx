"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import {
  blogCategories,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBlog = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const { fetchBlogs } = useAppData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiBlogLoading, setAiBlogLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null as File | null,
    blogcontent: "",
  });

  const handleInputChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e: any) =>
    setFormData({ ...formData, image: e.target.files[0] });

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post(
        "/api/blog/ai/grammarcheck/",
        { blog: formData.blogcontent }
      );
      setContent(data.html);
      setFormData({ ...formData, blogcontent: data.html });
    } catch {
      toast.error("AI grammar fix failed");
    } finally {
      setAiBlogLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v) fd.append(k === "image" ? "file" : k, v as any);
    });

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        "/api/blog/create",
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      fetchBlogs();
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });
      setContent("");
      setTimeout(()=>{fetchBlogs();}, 3000);
      router.push("/blogs/myblogs");
    } catch {
      toast.error("Error while posting blog");
    } finally {
      setLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-2xl font-bold text-orange-600">
            POST A NEW BLOG
          </h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-4">
              <Label className="text-zinc-800">Title</Label>
              <Input
                className="mt-2"
                placeholder="Enter blog title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label className="text-zinc-800">Description</Label>
              <Input
                className="mt-2"
                placeholder="Enter blog description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label className="text-zinc-800">Category</Label>
              <Select
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label className="text-zinc-800">Thumbnail</Label>
              <Input
                type="file"
                className="mt-3"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* BLOG CONTENT */}
            <div className="mb-4">
              <Label className="text-zinc-800 mb-4">Blog Content</Label>

              <div className="flex justify-end my-4">
                <Button
                  type="button"
                  size="sm"
                  onClick={aiBlogResponse}
                  disabled={aiBlogLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                >
                  <RefreshCw
                    size={16}
                    className={aiBlogLoading ? "animate-spin" : ""}
                  />
                  <span className="ml-2">Fix Grammar</span>
                </Button>
              </div>

              <div className="mt-3">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  onBlur={(v) => {
                    setContent(v);
                    setFormData({ ...formData, blogcontent: v });
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              {loading ? "Posting..." : "Post Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
