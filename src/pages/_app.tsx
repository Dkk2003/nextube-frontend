import { AuthProvider } from "@/contexts/auth";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <AuthProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
