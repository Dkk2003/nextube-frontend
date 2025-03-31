import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/Logo";
import Pencil from "@/components/icons/Pencil";

// ---------------------------
// State Management
// ---------------------------
const SignUp = () => {
  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // ---------------------------
  // Formik Setup & Validation
  // ---------------------------
  const {
    values,
    setFieldValue,
    handleSubmit,
    touched,
    handleBlur,
    handleChange,
    errors,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .required("Required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values);
      setStep(3);
    },
  });

  // ---------------------------
  // File Upload Handler
  // ---------------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setFieldValue("avatar", file);
    }
  };

  // ---------------------------
  // Component UI
  // ---------------------------
  return (
    <div className="grid w-full h-[calc(100vh-50px)] grid-cols-1 px-10 lg:grid-cols-3 flex-col gap-6 justify-center items-center">
      {/* Logo Section */}
      <div className="flex w-full items-start h-fit lg:h-full justify-start col-span-1">
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
        className="relative w-full max-w-xl overflow-hidden"
      >
        {step !== 3 && (
          <div className="flex justify-start w-full mb-1">
            <div className="text-3xl">Sign Up</div>
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
          <div className="w-full min-w-full px-1">
            {/* Profile Picture Upload */}
            <div className="w-full flex justify-center items-center">
              <div className="relative">
                <label className="flex justify-center items-center w-32 sm:w-40 md:w-48 lg:w-52 aspect-square border border-gray-300 rounded-full overflow-hidden cursor-pointer">
                  {image ? (
                    <Image
                      src={image}
                      alt="Profile Preview"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-center">
                      Upload <br /> Profile Image
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden select-none"
                  />
                  {image && (
                    <div className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full shadow-md flex items-center justify-center border-2 border-white">
                      <Pencil height={20} width={20} />
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Full Name Input */}
            <div className="flex flex-col gap-1 mt-4">
              <label className="text-neutralDivider">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                  touched.fullName && errors.fullName
                    ? "border-red-500"
                    : "border-dark-50"
                }`}
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullName && errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-logoRed text-white p-2 mt-4 rounded-md w-full"
            >
              Next
            </button>
          </div>

          {/* ---------------------------
              Step 2: Additional Fields 
          --------------------------- */}
          <div className="w-full min-w-full px-1">
            {/* Email Input */}
            <div className="flex flex-col gap-1 mt-4">
              <label className="text-neutralDivider">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-dark-50"
                }`}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Username Input */}
            <div className="flex flex-col gap-1 mt-4">
              <label className="text-neutralDivider">Username</label>
              <input
                type="text"
                name="username"
                placeholder="yourusername"
                className={`bg-transparent rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                  touched.username && errors.username
                    ? "border-red-500"
                    : "border-dark-50"
                }`}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1 mt-4">
              <label className="text-neutralDivider">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
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

            {/* Navigation Buttons */}
            <div className="flex w-full gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-blue-600 text-white font-bold w-1/6 p-2 rounded-md"
              >
                &lt;
              </button>
              <button
                type="submit"
                className="bg-logoRed text-white p-2 rounded-md w-full"
              >
                Submit
              </button>
            </div>
          </div>

          {/* ---------------------------
              Step 3: OTP Verification 
          --------------------------- */}
          <div className="w-full min-w-full px-1">
            <div className="text-3xl">Verify OTP</div>
            <button
              type="submit"
              className="bg-logoRed text-white p-2 rounded-md w-full mt-6"
            >
              Verify OTP
            </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default SignUp;
