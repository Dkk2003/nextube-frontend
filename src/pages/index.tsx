import UserAPI from "@/axios/user";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/auth";
import { Meta } from "@/layouts/Meta";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import Logo from "@/components/Logo";
import Profile from "@/components/Profile";
import { Main } from "@/templates/Main";
import nookies from "nookies";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const sidebarState = nookies.get(ctx)?.sidebarState === "true";

  return {
    props: {
      initialSidebarState: sidebarState, // Pass the state as a prop
    },
  };
};

const Home = ({ initialSidebarState }: { initialSidebarState: boolean }) => {
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

  console.log(user);
  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={<Meta title="Home - Nextube" description="Home - Nextube" />}
    >
      <div className="font-Inter w-full h-full text-white"></div>
    </Main>
  );
};

export default Home;
