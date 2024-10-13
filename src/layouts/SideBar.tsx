import { ReactNode } from "react";
import Header from "./Header";

interface SideBarProps {
  childrens: ReactNode;
}

const SideBar = ({ childrens }: SideBarProps) => {
  return (
    <div className="w-full">
      <Header />
    </div>
  );
};

export default SideBar;
