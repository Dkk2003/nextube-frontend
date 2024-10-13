import SideBar from "@/layouts/SideBar";
import type { ReactNode } from "react";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="font-roboto page-break w-full text-gray-700 antialiased overflow-hidden">
    {props.meta}

    <div className="mx-auto w-full">
      <SideBar childrens={props.children} />
    </div>
  </div>
);

export { Main };
