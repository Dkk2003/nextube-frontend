import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";
import UserType from "@/types/UserType";

const authMe = async (): Promise<ApiResponse<UserType>> => {
  return http.get("/users/current-user").then((res) => res.data);
};

const registerUser = async (
  email: string,
  username: string
): Promise<ApiResponse<{ otp: string }>> => {
  return http
    .post("/users/register", { email, username })
    .then((res) => res.data);
};

const verifyOtp = async (user: FormData): Promise<ApiResponse<UserType>> => {
  return http.post("/users/verifyOtp", user).then((res) => res.data);
};

const resendOtp = async (email: string): Promise<ApiResponse<{}>> => {
  return http.post("/users/resend-otp", { email }).then((res) => res.data);
};

const forgotPassword = async (email: string): Promise<ApiResponse<{}>> => {
  return http.post("/users/forgot-password", { email }).then((res) => res.data);
};

const resetPassword = async (
  newPassword: string,
  token: string
): Promise<ApiResponse<{}>> => {
  return http
    .post("/users/reset-password", { newPassword, token })
    .then((res) => res.data);
};

const loginUser = async (
  identifier: UserType["email"] | UserType["username"],
  password: UserType["password"]
): Promise<
  ApiResponse<{ user: UserType; accessToken: string; refreshToken: string }>
> => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier as string); // Proper email validation

  return http
    .post("/users/login", {
      ...(isEmail ? { email: identifier } : { username: identifier }),
      password, // Include password in the payload
    })
    .then((res) => res.data);
};

const logOut = async (): Promise<ApiResponse<{}>> => {
  return http.post("/users/logout", {}).then((res) => res.data);
};

const completeProfile = async (
  username: string,
  password: string
): Promise<ApiResponse<{}>> => {
  return http
    .patch("/users/complete-profile", { username, password })
    .then((res) => res.data);
};

const loginWithGoogle = async (
  accessToken: string
): Promise<
  ApiResponse<{ user: UserType; accessToken: string; refreshToken: string }>
> => {
  return http
    .post("/users/google-login", {
      accessToken,
    })
    .then((res) => res.data);
};

const UserAPI = {
  authMe,
  registerUser,
  loginUser,
  logOut,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  completeProfile,
};

export default UserAPI;
