import DownloadIcon from "@/components/icons/DownloadIcon";
import ReportIcon from "@/components/icons/ReportIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import { toast } from "react-toastify";

export const VIDEO_OPTIONS = [
  { id: 1, name: "Download", icon: <DownloadIcon /> },
  { id: 2, name: "Share", icon: <ShareIcon /> },
  { id: 2, name: "Report", icon: <ReportIcon /> },
];

export const CATAGORIES = [
  { id: 1, name: "All" },
  { id: 2, name: "Music" },
  { id: 3, name: "Live" },
  { id: 4, name: "Bollywood" },
  { id: 5, name: "Gadgets" },
  { id: 6, name: "All" },
  { id: 7, name: "Music" },
  { id: 8, name: "Live" },
  { id: 9, name: "Bollywood" },
  { id: 10, name: "Gadgets" },
  { id: 11, name: "All" },
  { id: 12, name: "Music" },
  { id: 13, name: "Live" },
  { id: 14, name: "Bollywood" },
  { id: 15, name: "Gadgets" },
  { id: 16, name: "All" },
  { id: 17, name: "Music" },
  { id: 18, name: "Live" },
  { id: 19, name: "Bollywood" },
  { id: 20, name: "Gadgets" },
];

export const successToast = (message: string) => toast.success(message);
export const errorToast = (message: string) => toast.error(message);
