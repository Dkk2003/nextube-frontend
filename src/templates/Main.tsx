import SideBar from "@/layouts/SideBar";
import type { ReactNode } from "react";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
  initialSidebar: boolean;
};

const Main = (props: IMainProps) => (
  <div className="font-roboto page-break w-full antialiased overflow-hidden">
    {props.meta}

    <div className="mx-auto w-full">
      <SideBar
        initialSidebar={props?.initialSidebar}
        childrens={props.children}
      />
    </div>
  </div>
);

export { Main };
