import HamburgerMenuIcons from "@/components/icons/HamburgerMenuIcons";
import SearchIcon from "@/components/icons/SearchIcon";
import Logo from "@/components/Logo";
import Profile from "@/components/Profile";
import { Dispatch, SetStateAction, useState } from "react";

const Header = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleClick = () => {
    if (setIsOpen) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex gap-10 w-full items-center justify-between p-4 border-b border-dark-50">
      <div className="flex items-center justify-center gap-2 md:gap-5">
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
      <div className="hidden md:flex items-center w-full border border-dark-50 max-w-[632px] rounded-full">
        {isSearchFocused && (
          <div className="flex pl-2.5 justify-center items-center">
            <SearchIcon />
          </div>
        )}
        <input
          placeholder="Search"
          className="w-full rounded-l-full py-1.5 px-2.5 placeholder:text-white outline-none bg-transparent border-r border-dark-50"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        <button className="flex bg-dark-50 rounded-r-full justify-center items-center w-[64px] p-1.5">
          <SearchIcon />
        </button>
      </div>
      <Profile />
    </div>
  );
};

export default Header;
