import UserAPI from "@/axios/user";
import Logo from "@/components/Logo";
import { unauthanticatedRoute } from "@/utils/authguard";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SignIn = () => {
  const router = useRouter();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Email or Username is required")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_.-]+$/,
        "Enter a valid email or username"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // ✅ Formik Setup
  const {
    handleBlur,
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      UserAPI.loginUser(values.identifier, values.password).then((res) => {
        if (res.statusCode === 200) {
          Cookies.set("accessToken", res?.data?.accessToken as string);
          router.push("/");
        }
      });
    },
  });

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

        {/* ✅ Form Start */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full sm:w-1/2 px-5 lg:w-1/3"
        >
          {/* ✅ Identifier (Email or Username) Field */}
          <div className="flex flex-col gap-1">
            <label className="text-neutralDivider">Email or Username</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="Enter your email or username"
              className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                touched.identifier && errors.identifier
                  ? "border-red-500"
                  : "border-dark-50"
              }`}
              value={values.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.identifier && errors.identifier && (
              <p className="text-red-500 text-sm">{errors.identifier}</p>
            )}
          </div>

          {/* ✅ Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-neutralDivider">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••••"
              className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                touched.password && errors.password
                  ? "border-red-500"
                  : "border-dark-50"
              }`}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* ✅ Sign In Button */}
          <button
            type="submit"
            className="bg-logoRed active:bg-logoRed/60 p-2 mt-2 rounded-md text-lg font-normal"
            disabled={isSubmitting}
          >
            Sign In
          </button>

          {/* ✅ Google Sign-In */}
          <button
            type="button"
            onClick={() => console.log("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign in with Google
          </button>

          {/* ✅ Sign Up Link */}
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="text-logoRed">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default SignIn;
