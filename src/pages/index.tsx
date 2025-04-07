import { useEffect, useRef, useState } from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import nookies from "nookies";
import { GetServerSideProps } from "next";
import Video from "@/components/Video";
import VideoType from "@/types/VideoType";
import VideoAPI from "@/axios/video";
import { CATAGORIES } from "@/utils/constants";
import { authanticatedRoute } from "@/utils/authguard";
import UserNameAndPasswordPopup from "@/components/UserNameAndPasswordModal";
import { useUser } from "@/contexts/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authanticatedRoute(ctx);
  const sidebarState = nookies.get(ctx)?.saidebarState === "true";

  return {
    props: {
      initialSidebarState: sidebarState,
    },
  };
};

const Home = ({ initialSidebarState }: { initialSidebarState: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  console.log("user>>", user);

  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const [videos, setVideos] = useState<VideoType[] | null>(null);
  const [columns, setColumns] = useState(3);
  const [userNameAndPasswordPopupIsOpen, setUserNameAndPasswordPopup] =
    useState<boolean>(false);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    VideoAPI.getVideos().then((res) => {
      console.log("video", res.data?.docs);
      setVideos(res?.data?.docs as VideoType[]);
    });
  }, []);

  useEffect(() => {
    if (user?.provider === "google" && !user?.password && !user?.username) {
      setUserNameAndPasswordPopup(true);
      console.log("model open");
    } else {
      setUserNameAndPasswordPopup(false);
    }
  }, [
    user?.password,
    user?.provider,
    user?.username,
    userNameAndPasswordPopupIsOpen,
  ]);

  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 1280) {
        setColumns(4); // 4 videos per row on extra-large screens
      } else if (screenWidth >= 1024) {
        setColumns(3); // 3 videos per row on large screens
      } else if (screenWidth >= 768) {
        setColumns(2); // 2 videos per row on tablets
      } else {
        setColumns(1); // 1 video per row on mobile
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={<Meta title="Home - Nextube" description="Home - Nextube" />}
    >
      <UserNameAndPasswordPopup
        isOpen={userNameAndPasswordPopupIsOpen}
        setIsOpen={setUserNameAndPasswordPopup}
      />

      <div
        id="video-div"
        className="font-Inter w-full h-full text-white flex flex-col gap-5"
      >
        <div className="relative max-w-full w-full">
          <div ref={containerRef} className="w-full flex gap-2 overflow-x-auto">
            {showLeftShadow && (
              <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[#333333] via-[#333333] to-transparent pointer-events-none" />
            )}

            {showRightShadow && (
              <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-[#333333] via-[#333333] to-transparent pointer-events-none" />
            )}

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
          className="grid gap-4 gap-y-5 overflow-y-auto pr-2"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            maxHeight: "calc(100vh - 150px)",
          }}
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
