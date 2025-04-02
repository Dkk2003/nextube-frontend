import Image from "next/image";
import Pencil from "./icons/Pencil";
import Skeleton from "./Skeleton";
import Spinner from "./Spinner";

interface SignupStep1Props {
  image: string | null;
  isLoading: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  touched: { fullName?: boolean; avatar?: boolean };
  errors: { fullName?: string; avatar?: string };
  values: { fullName: string };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  validateForm: () => Promise<{ fullName?: string; avatar?: string }>;
  setStep: (step: number) => void;
  setTouched: (touched: { fullName?: boolean; avatar?: boolean }) => void;
}

const SignupStep1: React.FC<SignupStep1Props> = ({
  image,
  handleFileChange,
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  validateForm,
  setStep,
  setTouched,
  isLoading,
}) => {
  return (
    <div className="w-full min-w-full px-1">
      {/* Profile Picture Upload */}
      <div className="w-full flex justify-center items-center">
        <div className="relative">
          {isLoading ? (
            <Skeleton className="w-32 sm:w-40 md:w-48 lg:w-52 aspect-square rounded-full overflow-hidden cursor-pointer" />
          ) : (
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
                name="avatar"
                onChange={handleFileChange}
                className="hidden select-none"
              />
              {image && (
                <div className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full shadow-md flex items-center justify-center border-2 border-white">
                  <Pencil height={20} width={20} />
                </div>
              )}
            </label>
          )}

          {touched.avatar && errors.avatar && (
            <p className="text-center text-red-500 text-sm mt-2">
              {errors.avatar}
            </p>
          )}
        </div>
      </div>

      {/* Full Name Input */}
      <div className="flex flex-col gap-1 mt-4">
        {isLoading ? (
          <Skeleton className={`rounded-md h-6 w-20 `} />
        ) : (
          <label className="text-neutralDivider">Full Name</label>
        )}

        {isLoading ? (
          <Skeleton className={`rounded-md p-6`} />
        ) : (
          <input
            type="text"
            name="fullName"
            autoComplete="off"
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
        )}

        {touched.fullName && errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName}</p>
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={async () => {
          const validationErrors = await validateForm();
          if (!validationErrors.fullName && !validationErrors.avatar) {
            setStep(2);
          } else {
            setTouched({ fullName: true, avatar: true });
          }
        }}
        className={`bg-logoRed text-white p-2 mt-4 rounded-md w-full flex justify-center items-center ${
          isLoading && "cursor-not-allowed"
        }`}
      >
        {isLoading ? <Spinner /> : "Next"}
      </button>
    </div>
  );
};

export default SignupStep1;
