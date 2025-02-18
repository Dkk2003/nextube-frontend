import { useState } from "react";
import SearchIcon from "./icons/SearchIcon";

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  return (
    <div className="hidden md:flex items-center w-full border border-dark-50 max-w-[632px] rounded-full">
      {isSearchFocused && (
        <div className="flex pl-2.5 justify-center items-center">
          <SearchIcon />
        </div>
      )}
      <input
        placeholder="Search"
        className="w-full placeholder:text-neutral-600 rounded-l-full py-1.5 px-2.5 outline-none bg-transparent border-r border-dark-50"
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />
      <button className="flex bg-dark-50 rounded-r-full justify-center items-center w-[64px] p-1.5">
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
