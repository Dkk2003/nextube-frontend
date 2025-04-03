import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/Logo";
import Pencil from "@/components/icons/Pencil";
import UserAPI from "@/axios/user";
import { errorToast, infoToast, successToast } from "@/utils/constants";
import OtpInput from "react-otp-input";
import { useRouter } from "next/router";
import { unauthanticatedRoute } from "@/utils/authguard";
import SignupStep1 from "@/components/SignupStep1";
import SignupStep2 from "@/components/SignupStep2";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";

// ---------------------------
// State Management
// ---------------------------
const SignUp = () => {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isUserRegLoading, setIsUserRegLoading] = useState<boolean>(false);
  const [isOtpLoading, setIsOtpLoading] = useState<boolean>(false);
  const [isResendOtpLoading, setIsResendOtpLoading] = useState<boolean>(false);

  // ---------------------------
  // Formik Setup & Validation
  // ---------------------------

  const otpVerification = async (user: FormData) => {
    setIsOtpLoading(true);
    UserAPI.verifyOtp(user)
      .then((res) => {
        if (res?.statusCode === 200) {
          successToast("Account created!");
          router.push("/signin");
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          errorToast("OTP no longer valid");
        }
      })
      .finally(() => {
        setIsOtpLoading(false);
      });
  };

  const regenrateOtp = async (email: string) => {
    setIsResendOtpLoading(false);
    UserAPI.resendOtp(email)
      .then((res) => {
        if (res.statusCode === 200) {
          successToast("OTP sent successfully");
        }
      })
      .catch((err) => {
        switch (err.status) {
          case 404:
            errorToast("Your Email does not exist");
            break;

          case 400:
            errorToast("Email is required");
            break;

          case 429:
            infoToast("OTP already sent");
            break;

          default:
            break;
        }
      })
      .finally(() => {
        setIsResendOtpLoading(false);
      });
  };

  const {
    values,
    setFieldValue,
    handleSubmit,
    touched,
    handleBlur,
    handleChange,
    errors,
    setTouched,
    validateForm,
  } = useFormik({
    initialValues: {
      avatar: null,
      fullName: "",
      email: "",
      username: "",
      password: "",
      otp: "",
    },
    validationSchema: Yup.object({
      avatar: Yup.mixed().required("Profile image is required"),
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      username: Yup.string().required("Required"),
      password: Yup.string()
        .required("Required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (value) => {
      const formData = new FormData();

      // Append all fields to FormData
      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("otp", values.otp);
      await otpVerification(formData);
      setStep(3);
    },
  });

  // ---------------------------
  // File Upload Handler
  // ---------------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setFieldValue("avatar", file);
    }
  };

  const signUpUser = async (email: string, username: string) => {
    setIsUserRegLoading(true);
    UserAPI.registerUser(email, username)
      .then((res) => {
        if (res?.statusCode === 200) {
          successToast("OTP has been sent to your email.");
          setStep(3);
        }
      })
      .catch((err) => {
        if (err.status === 409) {
          errorToast(
            `${
              err.response.data.conflictField === "username"
                ? "Username"
                : "Email"
            } already exists`
          );
        }
      })
      .finally(() => {
        setIsUserRegLoading(false);
      });
  };

  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission

    const errors = await validateForm();

    if (Object.keys(errors).length === 0) {
      await signUpUser(values.email, values.username);
    } else {
      setTouched({ email: true, username: true, password: true });
    }
  };

  // ---------------------------
  // Component UI
  // ---------------------------
  return (
    <div className="grid w-full h-[calc(100vh-50px)] grid-cols-1 px-10 lg:grid-cols-3 flex-col gap-6 justify-center items-center">
      {/* Logo Section */}
      <div className="flex w-full items-start h-fit lg:h-full justify-center lg:justify-start col-span-1">
        <div className="hidden md:flex min-w-[130px] items-center justify-center py-10">
          <Logo size={180} />
        </div>
        <div className="flex md:hidden min-w-[130px] items-center justify-center pt-10">
          <Logo size={150} />
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full lg:max-w-xl overflow-hidden"
      >
        {step !== 3 && (
          <div className="flex justify-start w-full mb-1">
            <div className="text-3xl">
              {isUserRegLoading ? (
                <Skeleton className={`rounded-md px-12 py-4`} />
              ) : (
                "Sign Up"
              )}
            </div>
          </div>
        )}

        {/* Motion Animation */}
        <motion.div
          className="flex"
          animate={{ x: step === 1 ? "0%" : step === 2 ? "-100%" : "-200%" }}
          transition={{ type: "spring", stiffness: 30 }}
        >
          {/* ---------------------------
              Step 1: Basic Info 
          --------------------------- */}

          <SignupStep1
            errors={{
              avatar: errors.avatar,
              fullName: errors.fullName,
            }}
            touched={{
              avatar: touched.avatar,
              fullName: touched.fullName,
            }}
            isLoading={isUserRegLoading}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            image={image}
            setStep={setStep}
            setTouched={setTouched}
            validateForm={validateForm}
            values={values}
          />

          {/* ---------------------------
              Step 2: Additional Fields 
          --------------------------- */}

          <SignupStep2
            errors={{
              email: errors.email,
              password: errors.password,
              username: errors.username,
            }}
            touched={{
              email: touched.email,
              password: touched.password,
              username: touched.username,
            }}
            isLoading={isUserRegLoading}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleFormSubmit={handleFormSubmit}
            setStep={setStep}
            values={values}
          />

          {/* ---------------------------
              Step 3: OTP Verification 
          --------------------------- */}
          <div className="flex flex-col gap-12 w-full min-w-full px-1">
            <div className="text-3xl">
              {isOtpLoading ? (
                <Skeleton className={`rounded-md w-fit px-12 py-4`} />
              ) : (
                "Verify OTP"
              )}
            </div>

            <div className="flex flex-col gap-2.5 font-Inter">
              {isOtpLoading ? (
                <Skeleton className={`rounded-md py-3 w-24`} />
              ) : (
                <p className="text-lg font-medium text-gray-100 tracking-wide ">
                  OTP Code
                </p>
              )}

              {isOtpLoading ? (
                <div className="grid grid-cols-4 gap-2.5">
                  <Skeleton className="h-10 rounded-[4px]" />
                  <Skeleton className="h-10 rounded-[4px]" />
                  <Skeleton className="h-10 rounded-[4px]" />
                  <Skeleton className="h-10 rounded-[4px]" />
                </div>
              ) : (
                <OtpInput
                  value={values.otp}
                  onChange={(otp) =>
                    handleChange({ target: { name: "otp", value: otp } })
                  }
                  numInputs={4}
                  placeholder="0000"
                  containerStyle="flex justify-center"
                  renderInput={(props, index) => (
                    <input
                      {...props}
                      key={index}
                      className={`border-2 ${
                        errors.otp && touched.otp
                          ? "border-red-600"
                          : "border-gray-300"
                      } focus:border-primary`}
                      name="otp"
                      type="text"
                      id="otp"
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const inputElement = e.currentTarget;
                        inputElement.value = inputElement.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                      style={{
                        flex: 1,
                        width: "40px",
                        height: "40px",
                        fontSize: "16px",
                        margin: "0 5px",
                        textAlign: "center",
                        borderRadius: "4px",
                        outline: "none",
                        color: "black",
                      }}
                    />
                  )}
                />
              )}
            </div>
            <div className="flex flex-col justify-center items-start gap-7">
              <button
                type="submit"
                disabled={isOtpLoading}
                className={`bg-logoRed text-white p-2 rounded-md w-full flex justify-center items-center ${
                  isOtpLoading && "cursor-not-allowed"
                }`}
              >
                {isOtpLoading ? <Spinner /> : "Verify OTP"}
              </button>
              <div className="text-sm tracking-wide">
                Didn&apos;t Receive?{" "}
                <button
                  type="button"
                  onClick={async () => {
                    await regenrateOtp(values.email);
                  }}
                  className="hover:underline"
                >
                  {" "}
                  Resend
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export const getServerSideProps = unauthanticatedRoute;
export default SignUp;
