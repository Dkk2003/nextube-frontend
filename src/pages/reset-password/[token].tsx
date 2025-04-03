import UserAPI from "@/axios/user";
import Logo from "@/components/Logo";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";
import { unauthanticatedRoute } from "@/utils/authguard";
import { errorToast, successToast } from "@/utils/constants";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";

const ForgotPassword = () => {
  const router = useRouter();

  const token = router?.query?.token as string;

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required("Required")
      .min(6, "Password must be at least 6 characters")
      .trim(),

    confirmNewPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
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
    initialValues: { newPassword: "", confirmNewPassword: "" },
    validationSchema,
    onSubmit: (value) => {
      UserAPI.resetPassword(value.newPassword, token)
        .then((res) => {
          if (res.statusCode === 200) {
            successToast("Password changed successfully!");
            router.push("/signin");
          }
        })
        .catch((err) => {
          switch (err.status) {
            case 400:
              errorToast("Reset link expired. Request a new one");
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
              <Skeleton className={`rounded-md px-20 py-4`} />
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
          {/* ✅ New Password Field */}
          <div className="flex flex-col gap-1">
            {isSubmitting ? (
              <Skeleton className={`rounded-md h-6 w-20 `} />
            ) : (
              <label className="text-neutralDivider">New Password</label>
            )}

            {isSubmitting ? (
              <Skeleton className={`rounded-md p-6`} />
            ) : (
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="••••••••••"
                className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                  touched.newPassword && errors.newPassword
                    ? "border-red-500"
                    : "border-dark-50"
                }`}
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}

            {touched.newPassword && errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>

          {/* ✅ Confirm New Password Field */}
          <div className="flex flex-col gap-1">
            {isSubmitting ? (
              <Skeleton className={`rounded-md h-6 w-20 `} />
            ) : (
              <label className="text-neutralDivider">
                Confirm New Password
              </label>
            )}

            {isSubmitting ? (
              <Skeleton className={`rounded-md p-6`} />
            ) : (
              <input
                type="text"
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                  touched.confirmNewPassword && errors.confirmNewPassword
                    ? "border-red-500"
                    : "border-dark-50"
                }`}
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}

            {touched.confirmNewPassword && errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          {/* ✅ Send Mail Button */}
          <button
            type="submit"
            className={`bg-logoRed active:bg-logoRed/60 p-2 mt-2 rounded-md text-base font-normal flex justify-center items-center ${
              isSubmitting && "cursor-not-allowed"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default ForgotPassword;
