import { ReactNode, useState } from "react";
import Header from "./Header";

interface SideBarProps {
  childrens: ReactNode;
}

const SideBar = ({ childrens }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log("hamburger", isOpen);
  return (
    <div className="w-full">
      <Header setIsOpen={setIsOpen} />
    </div>
  );
};

export default SideBar;
