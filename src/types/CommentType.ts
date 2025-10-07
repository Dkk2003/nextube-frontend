interface CommentType {
  _id: string;
  content: string;
  video: string; // video id
  owner: string; // user id
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default CommentType;