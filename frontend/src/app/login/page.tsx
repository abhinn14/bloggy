"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {useAppData, api_gateway} from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {useGoogleLogin} from "@react-oauth/google";
import {redirect} from "next/navigation";
import {ButtonLoading} from "@/components/Loading";

const LoginPage = () => {
  const {isAuth, setIsAuth, loading, setLoading, setUser} = useAppData();

  if(isAuth) redirect("/");

  const DEFAULT_AVATAR = "/avatar.png";

const responseGoogle = async (authResult: any) => {
  if (loading) return;
  setLoading(true);

  try {
    const result = await axios.post(`${api_gateway}/api/user/login`, {
      code: authResult.code,
    });

    const user = result.data.user;

    const finalUser = {
      ...user,
      image: user.image && user.image.trim() !== "" ? user.image : DEFAULT_AVATAR,
    };

    Cookies.set("token", result.data.token, {
      expires: 5,
      secure: true,
      path: "/",
    });

    setUser(finalUser);
    setIsAuth(true);
    toast.success(result.data.message);
  } catch {
    toast.error("Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: () => toast.error("Google authentication failed"),
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-start mt-10 justify-center px-4">
      <Card className="w-full max-w-sm shadow-md border">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl font-semibold">
            LOGIN ◔◡◔
          </CardTitle>
          <p className="text-sm text-gray-500">
            Create blogs or access your saved blogs!
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={googleLogin}
            disabled={loading}
            className="cursor-pointer w-full h-11 flex items-center justify-center gap-3
              bg-orange-500 text-white
              hover:bg-orange-600 active:scale-[0.98]">
            {loading ? (
              <ButtonLoading size={18} />
            ) : (
              <>
                <img src="/google.png" className="w-5 h-5" alt="Google" />
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-400">
            Secure Google sign-in · No spam
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
