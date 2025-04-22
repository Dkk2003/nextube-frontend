import { ApiResponse } from "@/types/ApiResponse";
import http from "./axios.config";
import SubscriptionType from "@/types/SubscriptionType";

const getSubscriber = async (
  channelId: string
): Promise<ApiResponse<SubscriptionType[]>> => {
  return http
    .get(`/subscription/getUserChannelSubscribers/${channelId}`)
    .then((res) => res.data);
};

export const SubscriptionAPI = {
  getSubscriber,
};
