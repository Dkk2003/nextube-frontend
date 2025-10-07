import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { GetServerSideProps } from "next";
import nookies from "nookies";
import { useEffect, useState } from "react";
import UserAPI from "@/axios/user";
import Video from "@/components/Video";
import VideoType from "@/types/VideoType";
import Spinner from "@/components/Spinner";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accessToken = nookies.get(ctx)?.accessToken;
  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }
  const sidebarState = nookies.get(ctx)?.sidebarState === "true";
  return { props: { initialSidebarState: sidebarState } };
};

const History = ({ initialSidebarState }: { initialSidebarState: boolean }) => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    UserAPI.getWatchHistory()
      .then((res) => setVideos((res.data as any) || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={<Meta title="History - Nextube" description="History - Nextube" />}
    >
      {loading ? (
        <div className="w-full h-[50vh] flex items-center justify-center"><Spinner /></div>
      ) : (
        <HistoryGrid videos={videos} />
      )}
    </Main>
  );
};

const HistoryGrid = ({ videos }: { videos: VideoType[] }) => {
  const [visibleCount, setVisibleCount] = useState(12);
  const showMore = () => setVisibleCount((c) => c + 12);
  const sliced = videos.slice(0, visibleCount);
  return (
    <div className="w-full">
      <div className="grid gap-4 gap-y-5 pr-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sliced.map((video) => (
          <Video key={video._id} id={video._id} video={video} duration={video.duration} />
        ))}
      </div>
      {visibleCount < videos.length && (
        <div className="w-full flex justify-center pt-4">
          <button className="px-4 py-2 bg-logoRed rounded-md" onClick={showMore}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
