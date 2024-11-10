import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";
import UserType from "@/types/UserType";
import VideoType from "@/types/VideoType";

const getVideos = async (): Promise<ApiResponse<{ docs: VideoType[] }>> => {
  return http.get("/videos/getPublicVideos").then((res) => res.data);
};

const VideoAPI = {
  getVideos,
};

export default VideoAPI;
