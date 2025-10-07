import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";

const toggleVideoLike = async (videoId: string): Promise<ApiResponse<any>> => {
  return http.post(`/like/toggleVideoLike/${videoId}`, {}).then((res) => res.data);
};

const toggleCommentLike = async (
  commentId: string
): Promise<ApiResponse<any>> => {
  return http
    .post(`/like/toggleCommentLike/${commentId}`, {})
    .then((res) => res.data);
};

const getLikedVideos = async (): Promise<ApiResponse<any>> => {
  return http.get(`/like/getLikedVideos`).then((res) => res.data);
};

const LikeAPI = {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideos,
};

export default LikeAPI;