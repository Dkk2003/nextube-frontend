import Logo from "@/components/Logo";
import { unauthanticatedRoute } from "@/utils/authguard";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  return (
    <div>
      <div className="w-full h-[calc(100vh-150px)] flex flex-col gap-4 justify-center items-center">
        <div className="hidden md:flex min-w-[130px] items-center justify-center p-10">
          <Logo size={180} />
        </div>
        <div className="flex md:hidden min-w-[130px] items-center justify-center p-10">
          <Logo size={150} />
        </div>
        <div className="flex justify-start w-full sm:w-1/2 px-5 lg:w-1/3">
          <div className="text-3xl">Sign in</div>
        </div>
        <form className="flex flex-col gap-3 w-full sm:w-1/2 px-5 lg:w-1/3">
          <div className="flex flex-col gap-1">
            <label className="text-neutralDivider">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@email.com"
              className="bg-transparent rounded-md placeholder:text-dark-50 outline-none border border-dark-50 p-1.5"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-neutralDivider">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••••"
              className="bg-transparent rounded-md placeholder:text-dark-50 outline-none border border-dark-50 p-1.5"
            />
          </div>
          <button
            type="submit"
            className="bg-logoRed active:bg-logoRed/60 p-2 mt-2 rounded-md text-lg font-normal"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign in with Google
          </button>
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/"} className="text-logoRed">
              Sign Up
            </Link>{" "}
            now!
          </p>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default SignIn;
