import Logo from "@/components/Logo";
import { unauthanticatedRoute } from "@/utils/authguard";
import Link from "next/link";

const EmailSentSuccess = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-6 justify-center items-center px-5">
      {/* Logo Section */}
      <div className="hidden md:flex min-w-[130px] items-center justify-center p-10">
        <Logo size={180} />
      </div>
      <div className="flex md:hidden min-w-[130px] items-center justify-center p-10">
        <Logo size={150} />
      </div>

      {/* Success Message */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Check Your Email</h1>
        <p className="text-sm text-gray-400 mt-2">
          We&apos;ve sent you a password reset link. Please check your inbox and
          follow the instructions.
        </p>
      </div>

      {/* Open Email & Login Links */}
      <div className="flex flex-col gap-3">
        <Link
          href={"https://mail.google.com/"}
          target="_blank"
          className="bg-logoRed text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-logoRed/80 transition"
        >
          Open Email
        </Link>

        <Link href="/signin" className="text-sm text-logoRed hover:underline">
          Go back to login
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default EmailSentSuccess;
