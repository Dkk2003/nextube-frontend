import UserAPI from "@/axios/user";
import Logo from "@/components/Logo";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";
import { unauthanticatedRoute } from "@/utils/authguard";
import { errorToast, successToast } from "@/utils/constants";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";

const ResetPassword = () => {
  const router = useRouter();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Required")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_.-]+$/,
        "Enter a valid Email"
      ),
  });
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    values,
    touched,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: (value) => {
      UserAPI.forgotPassword(value.email)
        .then((res) => {
          if (res.statusCode === 200) {
            successToast("Reset link sent! Check your email");
            router.push("/email-sended");
          }
        })
        .catch((err) => {
          switch (err.status) {
            case 400:
              errorToast("Email is not registered");
              break;

            default:
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
              "Forgot Password"
            )}
          </div>
        </div>

        {/* ✅ Form Start */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full sm:w-1/2 px-5 lg:w-1/3"
        >
          {/* ✅ Email Field */}
          <div className="flex flex-col gap-1">
            {isSubmitting ? (
              <Skeleton className={`rounded-md h-6 w-20 `} />
            ) : (
              <label className="text-neutralDivider">Email</label>
            )}
            {isSubmitting ? (
              <Skeleton className={`rounded-md p-6`} />
            ) : (
              <input
                type="text"
                id="email"
                name="email"
                placeholder="johndoe@gmail.com"
                className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-dark-50"
                }`}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}

            {touched.email && errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
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
            {isSubmitting ? <Spinner /> : "Send Mail"}
          </button>

          <div className="flex justify-center items-center">
            {isSubmitting ? (
              <div className="flex gap-1">
                <Skeleton className="h-3 w-48 rounded-sm" />
              </div>
            ) : (
              <Link href={"/signin"} className="text-sm text-neutralDivider">
                Go back to login, I remember
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default ResetPassword;
