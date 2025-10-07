interface VideoDetailType {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: string; // owner id (ObjectId string)
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export default VideoDetailType;