import HamburgerMenuIcons from "@/components/icons/HamburgerMenuIcons";
import SearchIcon from "@/components/icons/SearchIcon";
import Logo from "@/components/Logo";
import Profile from "@/components/Profile";
import SearchBar from "@/components/SearchBar";
import { Dispatch, SetStateAction, useState } from "react";
import Cookies from "js-cookie";

const Header = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClick = () => {
    if (setIsOpen) {
      setIsOpen((prev) => {
        const newState = !prev;
        Cookies.set("sidebarState", JSON.stringify(newState));
        return newState;
      });
    }
  };

  return (
    <div className="flex gap-10 w-full items-center justify-between p-3 md:p-4 border-b border-dark-50">
      <div className="flex select-none items-center justify-center gap-2 md:gap-5">
        <div
          onClick={() => {
            handleClick();
          }}
          className="cursor-pointer p-2 rounded-full hover:bg-dark-50"
        >
          <HamburgerMenuIcons />
        </div>
        <div className="hidden md:block min-w-[130px]">
          <Logo size={130} />
        </div>
      </div>
      <div className="block min-w-[100px] md:hidden">
        <Logo size={100} />
      </div>
      <SearchBar />
      <Profile />
    </div>
  );
};

export default Header;
