import { GetServerSideProps } from "next";
import nookies from "nookies";

const unauthanticatedRoute: GetServerSideProps = async (ctx) => {
  const accessToken = nookies.get(ctx)?.accessToken;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/current-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is okay
    if (!res.ok) {
      console.error('Failed to fetch user data:', res.status, await res.text()); // Log the error response
      return {
        props: {},
      };
    }

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
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      props: {},
      redirect: {
          permanent: false,
          destination: "/",
        },
    };
  }
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
