import UserAPI from "@/axios/user";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useUser } from "@/contexts/auth";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import nookies from "nookies";
import { GetServerSideProps } from "next";
import Video from "@/components/Video";
import VideoType from "@/types/VideoType";
import VideoAPI from "@/axios/video";
import { CATAGORIES } from "@/utils/constants";

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const sideBarIsOpen = Cookies.get("sidebarState") === "true";

  const [videos, setVideos] = useState<VideoType[] | null>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setShowLeftShadow(scrollLeft > 0); // Show left shadow if scrolled away from start
    setShowRightShadow(scrollLeft + clientWidth < scrollWidth); // Show right shadow if not at the end
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    UserAPI.loginUser({
      email: "darshan1010prajapati@gmail.com",
      password: "Test@123",
    }).then((res) => {
      console.log(res.data);
      Cookies.set("accessToken", res?.data?.accessToken as string);
    });
  }, []);

  useEffect(() => {
    VideoAPI.getVideos().then((res) => {
      console.log("video", res.data?.docs);
      setVideos(res?.data?.docs as VideoType[]);
    });
  }, []);

  console.log(user);
  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={<Meta title="Home - Nextube" description="Home - Nextube" />}
    >
      <div className="font-Inter w-full h-full text-white flex flex-col gap-5">
        <div className="relative max-w-full w-full">
          <div ref={containerRef} className="w-full flex gap-2 overflow-x-auto">
            {/* Left Shadow */}
            {showLeftShadow && (
              <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[#333333] via-[#333333] to-transparent pointer-events-none" />
            )}

            {/* Right Shadow */}
            {showRightShadow && (
              <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-[#333333] via-[#333333] to-transparent pointer-events-none" />
            )}

            {/* Category Items */}
            {CATAGORIES &&
              CATAGORIES.length > 0 &&
              CATAGORIES.map(({ id, name }) => {
                return (
                  <div
                    key={id}
                    className="font-Inter text-sm font-normal tracking-wide bg-black/20 px-2.5 py-1 rounded-md cursor-pointer"
                  >
                    {name}
                  </div>
                );
              })}
          </div>
        </div>

        <div
          className={`grid ${
            sideBarIsOpen ? "grid-cols-3" : "grid-cols-4"
          } gap-3`}
        >
          {videos &&
            videos?.length &&
            videos?.map((video) => {
              return (
                <Video
                  key={video?._id}
                  video={video}
                  id={video?._id}
                  duration={video?.duration}
                />
              );
            })}
        </div>
      </div>
    </Main>
  );
};

export default Home;
