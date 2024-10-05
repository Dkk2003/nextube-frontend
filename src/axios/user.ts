import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";
import UserType from "@/types/UserType";

const authMe = async (): Promise<ApiResponse<UserType>> => {
  return http.get("/users/current-user").then((res) => res.data);
};

const registerUser = async (user: FormData): Promise<ApiResponse<UserType>> => {
  return http.post("/register", user).then((res) => res.data);
};

const loginUser = async (
  user: UserType
): Promise<
  ApiResponse<{ user: UserType; accessToken: string; refreshToken: string }>
> => {
  return http.post("/users/login", user).then((res) => res.data);
};

const logOut = async (): Promise<ApiResponse<{}>> => {
  return http.post("/users/logout", {}).then((res) => res.data);
};

const UserAPI = {
  authMe,
  registerUser,
  loginUser,
  logOut,
};

export default UserAPI;
