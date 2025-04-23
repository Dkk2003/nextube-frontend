import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/auth";
import UserAPI from "@/axios/user";
import { errorToast } from "@/utils/constants";
import Image from "next/image";

const GoogleLoginButton = () => {
  const router = useRouter();

  const { setUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      if (credentialResponse?.access_token) {
        setIsLoading(true);

        UserAPI.loginWithGoogle(credentialResponse?.access_token)
          .then((response) => {
            if (
              response?.statusCode === 200 &&
              response?.data?.accessToken &&
              response?.data?.user
            ) {
              Cookies.set("accessToken", response?.data?.accessToken, {
                expires: 1,
              });
              setUser(response?.data?.user);
              router.push("/");
            }
          })
          .catch(() => {
            errorToast("Something Went Wrong");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
  });

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleLoginWithGoogle();
      }}
      type="button"
      disabled={isLoading}
      className={`flex items-center justify-center gap-3 px-6 py-2 w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 font-medium transition-all duration-200 hover:bg-gray-100 ${
        isLoading ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <Image
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
        height={100}
        width={100}
      />
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleLoginButton;
