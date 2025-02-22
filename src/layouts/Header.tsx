import HamburgerMenuIcons from "@/components/icons/HamburgerMenuIcons";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Cookies from "js-cookie";
import Profile from "@/components/Profile";
import Button from "@/components/Button";
import ProfileIcon from "@/components/icons/ProfileIcon";
import SignOutIcon from "@/components/icons/SignOutIcon";
import { useUser } from "@/contexts/auth";
import { useRouter } from "next/router";

const Header = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, logOut } = useUser();
  const router = useRouter();

  console.log("isAuthenticated>>", isAuthenticated);

  // Detect Mobile Screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {/* Left Section */}
      <div className="flex select-none items-center justify-center gap-2 md:gap-5">
        <div
          onClick={handleClick}
          className="cursor-pointer p-2 rounded-full hover:bg-dark-50"
        >
          <HamburgerMenuIcons />
        </div>
        <div className="hidden md:block min-w-[130px]">
          <Logo size={130} />
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="block min-w-[100px] md:hidden">
        <Logo size={100} />
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Profile Section */}
      <div
        className="relative"
        onMouseEnter={() => !isMobile && setIsProfileOpen(true)}
        onClick={() => {
          setIsProfileOpen(!isProfileOpen);
        }}
        // onMouseLeave={() => !isMobile && setIsProfileOpen(false)}
      >
        <div
          className="cursor-pointer"
          onClick={() => isMobile && setIsProfileOpen((prev) => !prev)}
        >
          <Profile />
        </div>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div
            className="absolute right-0 mt-2 w-52 bg-neutralLight shadow-lg rounded-lg p-2 z-10"
            onMouseLeave={() => !isMobile && setIsProfileOpen(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="flex items-center gap-3 text-white w-full text-base text-left px-2 py-2 text-dark rounded-lg hover:bg-neutralDivider">
              <ProfileIcon /> Profile
            </Button>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logOut();
                }}
                className="flex items-center gap-3 text-white w-full text-left text-base px-2 py-2 text-dark rounded-lg hover:bg-neutralDivider"
              >
                <SignOutIcon />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  router.push("/signin");
                }}
                className="flex items-center gap-3 text-white w-full text-left text-base px-2 py-2 text-dark rounded-lg hover:bg-neutralDivider"
              >
                <SignOutIcon />
                Sign In / Sign Up
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
