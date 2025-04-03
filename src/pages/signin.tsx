import UserAPI from "@/axios/user";
import Logo from "@/components/Logo";
import { unauthanticatedRoute } from "@/utils/authguard";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { errorToast } from "@/utils/constants";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";

const SignIn = () => {
  const router = useRouter();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Required")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_.-]+$/,
        "Enter a valid email or username"
      ),
    password: Yup.string()
      .required("Required")
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
    setSubmitting,
  } = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      UserAPI.loginUser(values.identifier, values.password)
        .then((res) => {
          if (res.statusCode === 200) {
            Cookies.set("accessToken", res?.data?.accessToken as string);
            router.push("/");
          }
        })
        .catch((err) => {
          if (err.status === 500) {
            errorToast("User does not exist");
          }

          switch (err.status) {
            case 500:
              errorToast("User does not exist");
              break;

            case 401:
              errorToast("Incorrect password. Try again!");
              break;
          }
        })
        .finally(() => {
          setSubmitting(false);
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
          <div className="text-3xl">
            {isSubmitting ? (
              <Skeleton className={`rounded-md px-12 py-4`} />
            ) : (
              "Sign In"
            )}
          </div>
        </div>

        {/* ✅ Form Start */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full sm:w-1/2 px-5 lg:w-1/3"
        >
          {/* ✅ Identifier (Email or Username) Field */}
          <div className="flex flex-col gap-1">
            {isSubmitting ? (
              <Skeleton className={`rounded-md h-6 w-20 `} />
            ) : (
              <label className="text-neutralDivider">Email or Username</label>
            )}
            {isSubmitting ? (
              <Skeleton className={`rounded-md p-6`} />
            ) : (
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
            )}

            {touched.identifier && errors.identifier && (
              <p className="text-red-500 text-sm">{errors.identifier}</p>
            )}
          </div>

          {/* ✅ Password Field */}
          <div className="flex flex-col gap-1">
            {isSubmitting ? (
              <Skeleton className={`rounded-md h-6 w-20 `} />
            ) : (
              <label className="text-neutralDivider">Password</label>
            )}

            {isSubmitting ? (
              <Skeleton className={`rounded-md p-6`} />
            ) : (
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
            )}

            {touched.password && errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end items-center">
            {isSubmitting ? (
              <Skeleton className={`rounded-md h-4 w-28`} />
            ) : (
              <a
                href="/reset-password"
                className="text-sm text-blue-400 font-normal tracking-wide hover:underline"
              >
                Forgot Password?
              </a>
            )}
          </div>

          {/* ✅ Sign In Button */}
          <button
            type="submit"
            className={`bg-logoRed active:bg-logoRed/60 p-2 mt-2 rounded-md text-base font-normal flex justify-center items-center ${
              isSubmitting && "cursor-not-allowed"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Sign In"}
          </button>

          {isSubmitting ? (
            <div className="flex items-center my-4">
              <Skeleton className="flex-grow h-[1px] bg-dark-50" />
              <Skeleton className="mx-8 h-4 w-32 bg-dark-50 rounded-md" />
              <Skeleton className="flex-grow h-[1px] bg-dark-50" />
            </div>
          ) : (
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-dark-50"></div>
              <span className="mx-8 text-xs tracking-wider text-dark-50">
                or continue with
              </span>
              <div className="flex-grow border-t border-dark-50"></div>
            </div>
          )}

          {/* ✅ Google Sign-In */}
          <button
            type="button"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isSubmitting && "cursor-not-allowed"
            }`}
          >
            Sign in with Google
          </button>

          {/* ✅ Sign Up Link */}
          {isSubmitting ? (
            <div className="flex gap-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-12 bg-logoRed" />
            </div>
          ) : (
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/signup"} className="text-logoRed">
                Sign Up
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default SignIn;
