interface ChannelType {
  _id: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  createdAt: string | Date;
  username: string;
  subscribersCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
}

export default ChannelType;
