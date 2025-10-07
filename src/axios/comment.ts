import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";
import CommentType from "@/types/CommentType";

const getVideoComments = async (
  videoId: string,
  page = 1,
  limit = 10
): Promise<ApiResponse<CommentType[]>> => {
  return http
    .get(`/comment/getVideoComments/${videoId}`, {
      params: { page, limit },
    })
    .then((res) => res.data);
};

const addComment = async (
  videoId: string,
  content: string
): Promise<ApiResponse<CommentType>> => {
  return http
    .post(`/comment/addComment`, { videoId, content })
    .then((res) => res.data);
};

const updateComment = async (
  videoId: string,
  commentId: string,
  newContent: string
): Promise<ApiResponse<CommentType>> => {
  return http
    .patch(`/comment/updateComment`, { videoId, commentId, newContent })
    .then((res) => res.data);
};

const deleteComment = async (
  videoId: string,
  commentId: string
): Promise<ApiResponse<CommentType>> => {
  return http
    .del(`/comment/deleteComment`, { data: { videoId, commentId } })
    .then((res) => res.data);
};

const CommentAPI = {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};

export default CommentAPI;
