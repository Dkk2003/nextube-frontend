import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import HomeIcon from "@/components/icons/HomeIcon";
import Link from "next/link";
import LikedIcon from "@/components/icons/LikedIcon";
import HistoryIcon from "@/components/icons/HistoryIcon";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

interface SideBarProps {
  childrens: ReactNode;
  initialSidebar: boolean;
}

const SIDE_MENUES: {
  id: number;
  name: string;
  path: string;
  icon: ReactNode;
}[] = [
  {
    id: 1,
    name: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    id: 2,
    name: "Liked Videos",
    icon: <LikedIcon />,
    path: "/likedvideo",
  },
  {
    id: 3,
    name: "History",
    icon: <HistoryIcon />,
    path: "/history",
  },
];

const SideBar = ({ childrens, initialSidebar }: SideBarProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(initialSidebar);

  useEffect(() => {
    const savedState = Cookies.get("sidebarState");
    if (savedState !== null && savedState !== undefined) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      Cookies.set("sidebarState", JSON.stringify(newState), {
        expires: 364635, // Expire after 999 years
      });
      return newState;
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header fixed at the top */}
      <Header setIsOpen={toggleSidebar} />

      <div className="w-full flex h-full">
        <div
          className={`${
            isOpen ? "min-w-16 max-w-52 rounded-r-lg" : "min-w-16 max-w-16"
          } hidden md:flex flex-col gap-1 w-full bg-neutralLight/20 transition-all duration-300 h-full p-2 fixed`}
        >
          {SIDE_MENUES &&
            SIDE_MENUES?.length &&
            SIDE_MENUES?.map(({ id, icon, name, path }) => {
              return (
                <Link
                  key={`menu_${id}`}
                  href={path}
                  className={`${
                    router?.asPath === path && "bg-black/20 rounded-md"
                  } flex w-full items-center p-2.5 gap-5`}
                >
                  <div className="min-w-6 max-w-6 w-full flex">{icon}</div>
                  <div
                    className={`${
                      isOpen ? "block" : "hidden"
                    } whitespace-nowrap transition-all duration-400`}
                  >
                    {name}
                  </div>
                </Link>
              );
            })}
        </div>
        <div
          className={`${
            isOpen ? "translate-x-0 rounded-r-lg" : "-translate-x-full"
          } absolute max-w-52 top-[64.8px] flex flex-col gap-1 md:hidden w-full transition-all duration-300 h-full bg-neutralLight/20 border-dark-50 p-2`}
        >
          {SIDE_MENUES &&
            SIDE_MENUES?.length &&
            SIDE_MENUES?.map(({ id, icon, name, path }) => {
              return (
                <Link
                  key={`menu_${id}`}
                  href={path}
                  className={`${
                    router?.asPath === path && "bg-black/20 rounded-md"
                  } flex w-full items-center p-3 gap-5`}
                >
                  <div className="min-w-6 max-w-6 w-full flex">{icon}</div>
                  <div className="whitespace-nowrap transition-all duration-400">
                    {name}
                  </div>
                </Link>
              );
            })}
        </div>

        <div className="w-full h-full overflow-y-auto">{childrens}</div>
      </div>
    </div>
  );
};

export default SideBar;
