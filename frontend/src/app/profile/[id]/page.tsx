"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, api_gateway } from "@/context/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Linkedin } from "lucide-react";
import { useParams } from "next/navigation";
import { PageLoading } from "@/components/Loading";

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        `${api_gateway}/api/user/getuser/${id}`
      );
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) return <PageLoading />;

  return (
    <div className="flex justify-center items-start mt-10 min-h-screen px-4">
      <Card className="w-full max-w-xl border border-orange-200 shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            PROFILE
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-5">
          {/* AVATAR */}
          <Avatar className="w-28 h-28 border-4 border-orange-200 shadow-md mb-6">
            <AvatarImage src={user.image} alt="profile" />
          </Avatar>

          {/* INFO */}
          <div className="w-full text-center space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="mb-6 font-medium text-gray-900">{user.name}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
