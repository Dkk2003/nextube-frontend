import UserAPI from "@/axios/user";
import UserType from "@/types/UserType";
import { GetServerSideProps } from "next";
import nookies from "nookies";
import Cookies from "js-cookie";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextProps {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  userLoading: boolean;
  isLogoutLoading: boolean;
  isAuthenticated: boolean;
  getUser: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(true);
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);
  const accessToken = Cookies?.get("accessToken");

  const getUser = async () => {
    setUserLoading(true);
    UserAPI.authMe()
      .then((res) => {
        if (res?.data) {
          setUser(res?.data);
          setisAuthenticated(true);
        }
      })
      .finally(() => {
        setUserLoading(false);
      });
  };

  const logOut = async () => {
    setIsLogoutLoading(true);
    UserAPI.logOut()
      .then((res) => {
        if (res?.statusCode === 200) {
          setUser(null);
          setisAuthenticated(false);
          Cookies.remove("accessToken");
        }
      })
      .finally(() => {
        setIsLogoutLoading(false);
      });
  };

  useEffect(() => {
    if (accessToken) {
      getUser();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLogoutLoading,
        userLoading,
        getUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
