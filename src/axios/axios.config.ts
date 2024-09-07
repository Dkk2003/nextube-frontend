import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

interface Config extends AxiosRequestConfig {}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("accessToken");
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";

    return Promise.resolve(config);
  },
  async (err) => {
    return Promise.reject(err);
  }
);

const get = (url: string, config: Config = {}): Promise<AxiosResponse> =>
  axios.get(url, config);

const post = <T>(
  url: string,
  data: T,
  config: Config = {}
): Promise<AxiosResponse> => axios.post(url, data, config);

const put = <T>(
  url: string,
  data: T,
  config: Config = {}
): Promise<AxiosResponse> => axios.put(url, data, config);

const patch = <T>(
  url: string,
  data: T,
  config: Config = {}
): Promise<AxiosResponse> => axios.patch(url, data, config);

const del = (url: string, config: Config = {}): Promise<AxiosResponse> =>
  axios.delete(url, config);

const http = {
  get,
  post,
  put,
  patch,
  del,
};

export default http;
