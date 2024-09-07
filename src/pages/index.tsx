import UserAPI from "@/axios/user";
import Logo from "../components/Logo";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    UserAPI.loginUser({
      email: "darshan1010prajapati@gmail.com",
      password: "Test@123",
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-3 justify-center items-center">
      <Logo />
      <p className="text-lg">Coming Soon</p>
    </div>
  );
};

export default Home;
