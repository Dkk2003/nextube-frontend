import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
import MoreDetailIcon from "./icons/MoreDetailIcon";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoProps {
  duration: number;
}

const Video = ({ duration }: VideoProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  return (
    <div className="max-w-[400px] w-full h-full flex flex-col border-red-600 gap-2.5 cursor-pointer">
      {isPlaying ? (
        <div
          onMouseEnter={() => setIsPlaying(true)}
          onMouseLeave={() => setIsPlaying(false)}
          className="relative max-h-56 max-w-full rounded-lg overflow-hidden"
        >
          <ReactPlayer
            height={225}
            width={"100%"}
            controls
            volume={1}
            playing={isPlaying}
            url={
              "https://www.youtube.com/embed/7D198nSeAT0?si=hUI0_J_cSMgLcImh"
            }
            style={{ borderRadius: "24px" }}
          />
          {!isPlaying && (
            <div className="absolute bottom-2 right-2 bg-black/50 bg-opacity-70 text-white px-2 py-1 text-sm rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>
      ) : (
        <div
          onMouseEnter={() => setIsPlaying(true)}
          onMouseLeave={() => setIsPlaying(false)}
          className="relative max-h-56 max-w-full rounded-lg overflow-hidden"
        >
          <Image
            src={
              "https://i.ytimg.com/vi/7D198nSeAT0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBarX5uJXrWZ-IFhISbE_NS7hi8vA"
            }
            alt="thumbnail"
            height={225}
            width={400}
          />
          {!isPlaying && (
            <div className="absolute bottom-2 right-2 bg-black/70 bg-opacity-70 text-white px-2 py-0.5 text-sm rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between gap-1.5 w-full">
        <div className="flex gap-3 items-start">
          <Image
            src={
              "https://yt3.ggpht.com/ytc/AIdro_mxwZ4148OTGpW105pxEAX-Rd7R516Om_nZW2Xdm5sXQQ=s88-c-k-c0x00ffffff-no-rj"
            }
            alt="profile image"
            width={100}
            height={100}
            className="w-9 h-9 mt-1 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-base font-normal leading-5 tracking-wide line-clamp-2">
              Agam - Madhurashtakam | Adharam Madhuram | Krishna Janmashtami |
              POPULAR NEW KRISHNA BHAJAN
            </p>
            <p className="text-base text-[#aaa] font-semibold">Agam Aggarwal</p>
          </div>
        </div>
        {/* <div>Image</div> */}
        <span className="flex flex-col">
          <MoreDetailIcon />
        </span>
      </div>
    </div>
  );
};

export default Video;
