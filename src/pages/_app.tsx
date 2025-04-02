import { AuthProvider } from "@/contexts/auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastContainer />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
