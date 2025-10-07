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

const toggleSubscription = async (
  channelId: string
): Promise<ApiResponse<any>> => {
  return http
    .post(`/subscription/toggleSubscription/${channelId}`, {})
    .then((res) => res.data);
};

const getSubscribedChannels = async (
  subscriberId: string
): Promise<ApiResponse<SubscriptionType[]>> => {
  return http
    .get(`/subscription/getSubscribedChannels/${subscriberId}`)
    .then((res) => res.data);
};

export const SubscriptionAPI = {
  getSubscriber,
  toggleSubscription,
  getSubscribedChannels,
};
