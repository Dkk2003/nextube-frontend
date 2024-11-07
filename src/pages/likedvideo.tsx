import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { GetServerSideProps } from "next";
import nookies from "nookies";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const sidebarState = nookies.get(ctx)?.sidebarState === "true";

  return {
    props: {
      initialSidebarState: sidebarState, // Pass the state as a prop
    },
  };
};

const LikedVideo = ({
  initialSidebarState,
}: {
  initialSidebarState: boolean;
}) => {
  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={
        <Meta
          title="Liked Videos - Nextube"
          description="Liked Videos - Nextube"
        />
      }
    >
      <></>
    </Main>
  );
};

export default LikedVideo;
