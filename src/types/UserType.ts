import VideoType from "./VideoType";

interface UserType {
  _id?: string;
  username?: string;
  password?: string;
  email: string;
  fullName?: string;
  avatar?: string;
  coverImage?: string;
  watchHistory?: VideoType[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export default UserType;
