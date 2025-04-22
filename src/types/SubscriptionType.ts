interface SubscriptionType {
  _id: string;
  provider: "google" | "email"; // Assuming only these, adjust as needed
  email: string;
  fullName: string;
  avatar: string;
  watchHistory: any[]; // Replace `any` with a more specific type if known
  createdAt: string | Date; // ISO date string
  updatedAt: string | Date; // ISO date string
  username: string;
  refreshToken: string;
}

export default SubscriptionType;
