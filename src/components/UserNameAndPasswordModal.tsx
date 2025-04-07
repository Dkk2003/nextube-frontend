import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "./icons/CloseIcon";
import Skeleton from "./Skeleton";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "./Spinner";
import UserAPI from "@/axios/user";
import { errorToast, successToast } from "@/utils/constants";
import { useUser } from "@/contexts/auth";

interface UserNameAndPasswordModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const UserNameAndPasswordModal = ({
  isOpen,
  setIsOpen,
}: UserNameAndPasswordModalProps) => {
  const { getUser } = useUser();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Required")
      .test(
        "is-lowercase",
        "Username must be lowercase",
        (value) => value === value?.toLowerCase()
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
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (value) => {
      UserAPI.completeProfile(value?.username, value?.password)
        .then((res) => {
          if (res.statusCode === 200) {
            successToast("Profile Completed!");
            setIsOpen(false);
            getUser();
          }
        })
        .catch((err) => {
          switch (err.status) {
            case 409:
              errorToast("Username already taken");
              break;

            case 404:
              errorToast("Please Signup");
              break;

            case 400:
              errorToast("Something went wrong");
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
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-5 overflow-y-auto">
          <div className="bg-primaryBg p-5 sm:p-6 rounded-xl w-full max-w-lg shadow-lg relative max-h-screen overflow-y-auto">
            <div className="flex justify-start items-center mb-4">
              {isSubmitting ? (
                <Skeleton className="rounded-md px-24 py-3" />
              ) : (
                <h2 className="text-base md:text-xl font-semibold text-white">
                  Complete Your Profile
                </h2>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 w-full"
            >
              {/* Username Input */}
              <div className="flex flex-col gap-1">
                {isSubmitting ? (
                  <Skeleton className="rounded-md h-6 w-20" />
                ) : (
                  <label className="text-neutralDivider">Username</label>
                )}

                {isSubmitting ? (
                  <Skeleton className="rounded-md p-6" />
                ) : (
                  <input
                    type="text"
                    name="username"
                    autoComplete="off"
                    placeholder="username"
                    className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 w-full ${
                      touched.username && errors.username
                        ? "border-red-500"
                        : "border-dark-50"
                    }`}
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                )}

                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                {isSubmitting ? (
                  <Skeleton className="rounded-md h-6 w-20" />
                ) : (
                  <label className="text-neutralDivider">Password</label>
                )}

                {isSubmitting ? (
                  <Skeleton className="rounded-md p-6" />
                ) : (
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="off"
                    className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 w-full ${
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-logoRed text-white p-2 mt-2 rounded-md w-full flex justify-center items-center ${
                  isSubmitting && "cursor-not-allowed"
                }`}
              >
                {isSubmitting ? <Spinner /> : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNameAndPasswordModal;
