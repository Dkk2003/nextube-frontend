import { GetServerSideProps } from "next";
import nookies from "nookies";

const unauthanticatedRoute: GetServerSideProps = async (ctx) => {
  const accessToken = nookies.get(ctx)?.accessToken;
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/current-user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (res) => {
    const user = await res.json();

    if (user && user?._id) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
    return {
      props: {},
    };
  });
};

const authanticatedRoute: GetServerSideProps = async (ctx) => {
  const accessToken = nookies.get(ctx)?.accessToken;
  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }
  return { props: {} };
};

export { unauthanticatedRoute, authanticatedRoute };
