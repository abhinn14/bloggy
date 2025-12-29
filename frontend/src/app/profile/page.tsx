"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/context/AppContext";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { PageLoading } from "@/components/Loading";
import { Linkedin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
  const {user, setUser} = useAppData();
  const router = useRouter();
  useEffect(() => {
    if(!user) router.push("/login");
  }, [user, router]);
  
  if(!user)  return <PageLoading />;

  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    linkedin: user.linkedin || "",
    bio: user.bio || "",
  });
  const triggerUpload = () => inputRef.current?.click();

  const changeHandler = async (e: any) => {
    const file = e.target.files[0];
    if(!file) return;

    try {
      setLoading(true);
      const token = Cookies.get("token");
      const form = new FormData();
      form.append("file", file);

      const {data} = await axios.put(
        "/api/user/update/pfp",
        form,
        {headers: {Authorization: `Bearer ${token}`}}
      );

      setUser(data.user);
      toast.success(data.message);
    } catch {
      toast.error("Image update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.put(
        "/api/user/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(data.user);
      toast.success(data.message);
      setOpen(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start mt-10 min-h-screen px-4">
      {loading ? (
        <PageLoading />
      ) : (
        <Card className="w-full max-w-xl border border-orange-200 shadow-lg rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              PROFILE
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            {/* AVATAR */}
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-orange-200 shadow-md">
                <AvatarImage src={user.image} alt="profile" />
              </Avatar>

              {/* CAMERA BUTTON */}
              <button
                onClick={triggerUpload}
                className="cursor-pointer
                  absolute bottom-1 right-1
                  w-9 h-9 rounded-full
                  bg-orange-500 text-white
                  flex items-center justify-center
                  shadow-md hover:bg-orange-600 transition
                "
              >
                <Camera size={16} />
              </button>

              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={changeHandler}
              />
            </div>

            {/* INFO */}
            <div className="w-full text-center space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>

              {user.bio && (
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}
            </div>

            {/* SOCIAL */}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <Linkedin size={26} />
              </a>
            )}

            {/* EDIT PROFILE */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  Edit Profile
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-3 focus-visible:ring-orange-500"
                    />
                  </div>

                  <div>
                    <Label>Bio</Label>
                    <Input
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="mt-3 focus-visible:ring-orange-500"
                    />
                  </div>

                  <div>
                    <Label>LinkedIn</Label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className="mt-3 focus-visible:ring-orange-500"
                    />
                  </div>

                  <Button
                    onClick={handleFormSubmit}
                    className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
