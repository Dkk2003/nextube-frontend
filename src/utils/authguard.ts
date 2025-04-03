import { GetServerSideProps } from "next";
import nookies from "nookies";

const unauthanticatedRoute: GetServerSideProps = async (ctx) => {
  const accessToken = nookies.get(ctx)?.accessToken;
  
  if (!accessToken) {
    return { props: {} }; // No token, allow access to the sign-in page
  } 
  else{
    return {
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
