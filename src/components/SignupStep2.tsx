import React from "react";
import Skeleton from "./Skeleton";
import Spinner from "./Spinner";

type SignupStep2Props = {
  values: {
    email: string;
    username: string;
    password: string;
  };
  touched: {
    email?: boolean;
    username?: boolean;
    password?: boolean;
  };
  errors: {
    email?: string;
    username?: string;
    password?: string;
  };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  setStep: (step: number) => void;
  handleFormSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const SignupStep2: React.FC<SignupStep2Props> = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setStep,
  handleFormSubmit,
  isLoading,
}) => {
  return (
    <div className="w-full min-w-full px-1">
      {/* Email Input */}
      <div className="flex flex-col gap-1 mt-4">
        {isLoading ? (
          <Skeleton className={`rounded-md h-6 w-20 `} />
        ) : (
          <label className="text-neutralDivider">Email</label>
        )}

        {isLoading ? (
          <Skeleton className={`rounded-md p-6`} />
        ) : (
          <input
            type="email"
            name="email"
            autoComplete="off"
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
        )}

        {touched.email && errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      {/* Username Input */}
      <div className="flex flex-col gap-1 mt-4">
        {isLoading ? (
          <Skeleton className={`rounded-md h-6 w-20 `} />
        ) : (
          <label className="text-neutralDivider">Username</label>
        )}

        {isLoading ? (
          <Skeleton className={`rounded-md p-6`} />
        ) : (
          <input
            type="text"
            name="username"
            autoComplete="off"
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
        )}

        {touched.username && errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1 mt-4">
        {isLoading ? (
          <Skeleton className={`rounded-md h-6 w-20 `} />
        ) : (
          <label className="text-neutralDivider">Password</label>
        )}

        {isLoading ? (
          <Skeleton className={`rounded-md p-6`} />
        ) : (
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="off"
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

      {/* Navigation Buttons */}
      <div className="flex w-full gap-4 mt-6">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => setStep(1)}
          className={`bg-blue-600 text-white font-bold w-1/6 p-2 rounded-md ${
            isLoading && "cursor-not-allowed"
          }`}
        >
          &lt;
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={handleFormSubmit}
          className={`bg-logoRed text-white p-2 rounded-md w-full flex justify-center items-center ${
            isLoading && "cursor-not-allowed"
          }`}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SignupStep2;
