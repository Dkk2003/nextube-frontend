import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";
import VideoType from "@/types/VideoType";

const getVideos = async (
  page = 1,
  limit = 12
): Promise<ApiResponse<{ docs: VideoType[]; page?: number; hasNextPage?: boolean; totalPages?: number }>> => {
  return http
    .get("/videos/getPublicVideos", { params: { page, limit } })
    .then((res) => res.data);
};

const getVideoById = async (
  videoId: string
): Promise<ApiResponse<any>> => {
  // Note: backend returns video with owner as ObjectId, not populated
  return http.get(`/videos/getVideo/${videoId}`).then((res) => res.data);
};

const publishVideo = async (
  formData: FormData
): Promise<ApiResponse<VideoType>> => {
  return http
    .post("/videos/publishVideo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

const VideoAPI = {
  getVideos,
  getVideoById,
  publishVideo,
};

export default VideoAPI;
