import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Image from "next/image";
import MoreDetailIcon from "./icons/MoreDetailIcon";
import { VIDEO_OPTIONS } from "@/utils/constants";
import VideoType from "@/types/VideoType";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoProps {
  duration: number;
  video: VideoType | null;
  id: VideoType["_id"];
}

const Video = ({ duration, video, id }: VideoProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showVideoMenus, setShowVideoMenus] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Handle hover to add delay before playing
  const handleMouseEnter = () => {
    const timeout = setTimeout(() => setIsPlaying(true), 300); // Delay in milliseconds
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsPlaying(false);
  };

  return (
    <div
      id={id}
      className="max-w-[360px] w-full h-full flex flex-col gap-2 cursor-pointer"
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[202px] rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
      >
        {isPlaying ? (
          <ReactPlayer
            height="100%"
            width="100%"
            volume={1}
            playing={isPlaying}
            url={video?.videoFile}
            style={{ borderRadius: "12px" }}
          />
        ) : (
          <Image
            src={video?.thumbnail as string}
            alt="thumbnail"
            height={202}
            width={360}
            className="w-full h-full object-cover rounded-lg transition-opacity duration-300 ease-in-out"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-sm rounded">
          {formatDuration(duration)}
        </div>
      </div>

      <div className="flex justify-between gap-2 w-full">
        <div className="flex gap-3 items-start">
          <Image
            src={video?.owner?.avatar as string}
            alt="profile image"
            width={100}
            height={100}
            className="w-9 h-9 mt-1 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-base font-medium leading-5 line-clamp-2">
              {video?.title}
            </p>
            <p className="text-sm text-gray-500">{video?.owner?.fullName}</p>
          </div>
        </div>

        <span className="relative">
          <div
            onClick={() => setShowVideoMenus(!showVideoMenus)}
            className="border rounded-full p-1 border-transparent hover:border-gray-300"
          >
            <MoreDetailIcon />
          </div>
          {showVideoMenus && (
            <div className="absolute min-w-[160px] w-full top-7 flex flex-col rounded-lg bg-black bg-opacity-75 p-2 shadow-lg space-y-2">
              {VIDEO_OPTIONS?.map(({ id, icon, name }) => (
                <div
                  key={id}
                  className="flex items-center w-full p-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <span className="mr-3 text-lg">{icon}</span>
                  <p className="text-sm font-normal text-white">{name}</p>
                </div>
              ))}
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default Video;
