import { GetServerSideProps } from "next";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import nookies from "nookies";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import VideoAPI from "@/axios/video";
import Video from "@/components/Video";
import VideoType from "@/types/VideoType";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const sidebarState = nookies.get(ctx)?.sidebarState === "true";
  return { props: { initialSidebarState: sidebarState } };
};

const SearchPage = ({ initialSidebarState }: { initialSidebarState: boolean }) => {
  const router = useRouter();
  const q = (router.query.q as string) || "";
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    VideoAPI.getVideos().then((res) => {
      setVideos(((res.data as any)?.docs || []) as VideoType[]);
    });
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return videos.filter((v) => v.title.toLowerCase().includes(term));
  }, [videos, q]);

  const [visibleCount, setVisibleCount] = useState(12);
  const showMore = () => setVisibleCount((c) => c + 12);
  const sliced = filtered.slice(0, visibleCount);

  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={<Meta title={`Search - ${q}`} description={`Search results for ${q}`} />}
    >
      <h1 className="text-xl font-semibold mb-4">Search results for: {q}</h1>
      <div className="grid gap-4 gap-y-5 pr-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sliced.map((video) => (
          <Video key={video._id} id={video._id} video={video} duration={video.duration} />
        ))}
      </div>
      {visibleCount < filtered.length && (
        <div className="w-full flex justify-center pt-4">
          <button className="px-4 py-2 bg-logoRed rounded-md" onClick={showMore}>
            Load more
          </button>
        </div>
      )}
    </Main>
  );
};

export default SearchPage;