import UserType from "./UserType";

interface VideoType {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: UserType;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export default VideoType;
