import UserAPI from "@/axios/user";
import Logo from "../components/Logo";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/auth";
const Home = () => {
  const { user } = useUser();
  useEffect(() => {
    UserAPI.loginUser({
      email: "darshan1010prajapati@gmail.com",
      password: "Test@123",
    }).then((res) => {
      console.log(res.data);
      Cookies.set("accessToken", res?.data?.accessToken as string);
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-3 justify-center items-center">
      <Logo />
      {user?.fullName}
      <p className="text-lg">Coming Soon</p>
    </div>
  );
};

export default Home;
