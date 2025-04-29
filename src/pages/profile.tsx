import { SubscriptionAPI } from "@/axios/subscriptions";
import UserAPI from "@/axios/user";
import EditIcon from "@/components/icons/EditIcon";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";
import { useUser } from "@/contexts/auth";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import ChannelType from "@/types/ChannelType";
import SubscriptionType from "@/types/SubscriptionType";
import { authanticatedRoute } from "@/utils/authguard";
import { errorToast, successToast } from "@/utils/constants";
import { isString, useFormik } from "formik";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Yup from "yup";

const MyProfile = ({
  initialSidebarState,
}: {
  initialSidebarState: boolean;
}) => {
  const { user, getUser } = useUser();

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [subscribers, setSubscribers] = useState<SubscriptionType[] | null>(
    null
  );
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCoverImageFileUploadClick = () => {
    if (coverFileInputRef.current) {
      coverFileInputRef.current.click();
    }
  };

  const handleAvatarImageFileUploadClick = () => {
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.click();
    }
  };

  const handleCoverFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChange(event);
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const minRatio = 2.5;
      const maxRatio = 4.5;

      if (aspectRatio < minRatio || aspectRatio > maxRatio) {
        errorToast(
          "Upload an image with a wide layout (between 2.5:1 and 4.5:1 aspect ratio)"
        );
        return;
      }

      setFieldValue("coverImage", file);
      setCoverPreviewUrl(url);
    };

    img.onerror = () => {
      errorToast("Invalid image file.");
    };

    img.src = url;
  };

  const handleAvatarFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChange(event);
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const img = new window.Image();

    img.onload = () => {
      setFieldValue("avatar", file);
      setAvatarPreviewUrl(url);
    };

    img.onerror = () => {
      errorToast("Invalid image file.");
    };

    img.src = url;
  };

  const getSubscriberData = (channelId: string) => {
    setIsLoading(true);
    SubscriptionAPI.getSubscriber(channelId)
      .then((res) => {
        setSubscribers(res.data as SubscriptionType[]);
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something Went Wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getChannelData = useCallback(() => {
    setIsLoading(true);
    if (user?.username) {
      UserAPI.getChannelDetails(user.username)
        .then((res) => {
          getSubscriberData(res?.data?._id as string);
          setChannel(res.data as ChannelType);
        })
        .catch((err) => {
          console.log(err);
          errorToast("Something Went Wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const updateProfileData = (user: { fullName: string; username: string }) => {
    setIsLoading(true);
    UserAPI.updateProfile(user)
      .then((res) => {
        if (res.statusCode === 200) {
          successToast("Profile Updated Successfully");
          setIsEditing(true);
        }
      })
      .catch((err) => {
        switch (err.status) {
          case 400:
            errorToast("Please Fill All Details");
            break;

          case 409:
            errorToast("Username already exists");
            break;

          default:
            break;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateAvatarImage = (avatar: FormData) => {
    setIsLoading(true);
    UserAPI.updateAvatar(avatar)
      .then((res) => {
        if (res.statusCode === 200) {
          successToast("Avatar Updated Successfully");
          setIsEditing(true);
        }
      })
      .catch((err) => {
        switch (err.status) {
          case 400:
            errorToast("Avatar file is missing");
            break;

          default:
            break;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateCoverImageData = (coverImage: FormData) => {
    setIsLoading(true);
    UserAPI.updateCoverImage(coverImage)
      .then((res) => {
        if (res.statusCode === 200) {
          successToast("Cover Image Updated Successfully");
          setIsEditing(true);
        }
      })
      .catch((err) => {
        switch (err.status) {
          case 400:
            errorToast("Coverimage file is missing");
            break;

          default:
            break;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getChannelData();
  }, [getChannelData]);

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
    enableReinitialize: true,
    initialValues: {
      avatar: null,
      coverImage: null,
      fullName: channel?.fullName || "",
      username: channel?.username || "",
    },
    validationSchema: Yup.object({
      avatar: Yup.mixed().nullable(),
      coverImage: Yup.mixed().nullable(),
      fullName: Yup.string().required("Required"),
      username: Yup.string().required("Required"),
    }),
    onSubmit: async (value) => {
      console.log("value", value);
      const fullNameChanged = value.fullName !== channel?.fullName;
      const userNameChanged = value.username !== channel?.username;
      const avatarChanged = value.avatar !== null;
      const coverImageChanged = value.coverImage !== null;

      // 1. If profile details changed (name or username)
      if (fullNameChanged || userNameChanged) {
        updateProfileData({
          fullName: value.fullName,
          username: value.username,
        });
      }

      // 2. If avatar changed
      if (avatarChanged && value.avatar) {
        const formData = new FormData();
        formData.append("avatar", value.avatar);
        updateAvatarImage(formData);
      }

      // 3. If cover image changed
      if (coverImageChanged && value.coverImage) {
        const formData = new FormData();
        formData.append("coverImage", value.coverImage);
        updateCoverImageData(formData);
      }
    },
  });

  return (
    <Main
      initialSidebar={initialSidebarState}
      meta={<Meta title="Profile - Nextube" description="Profile - Nextube" />}
    >
      {isLoading ? (
        <Skeleton className="w-32 h-7 rounded-lg" />
      ) : (
        <h1 className="text-xl sm:text-3xl tracking-wider font-Inter font-semibold leading-8">
          My Profile
        </h1>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 h-[calc(100vh+140px)] md:h-[calc(100vh+40px)]"
      >
        <div className="bg-[#1f1f1f] rounded-xl mt-4 sm:mt-6">
          <div className="relative rounded-xl max-h-40 sm:max-h-52 h-52 w-full bg-skeletonLoader">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : channel?.coverImage || coverPreviewUrl ? (
              <Image
                src={coverPreviewUrl || channel?.coverImage || ""}
                alt={channel?.fullName || "Cover image"}
                fill
                className="object-cover rounded-xl"
              />
            ) : (
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {coverPreviewUrl ? (
                  <Image
                    src={coverPreviewUrl || channel?.coverImage || ""}
                    alt="Cover"
                    height={1000}
                    width={1000}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      name="coverImage"
                      id="coverImage"
                      ref={coverFileInputRef}
                      onChange={handleCoverFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={handleCoverImageFileUploadClick}
                      className="hidden sm:flex absolute inset-0 w-full h-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-500 transition-colors duration-200 cursor-pointer bg-black/30"
                    >
                      <div className="p-2  rounded-full shadow-sm">
                        <EditIcon size={40} />
                      </div>
                      <p className="text-white font-medium text-sm sm:text-base">
                        Upload Cover Photo
                      </p>
                    </button>
                  </>
                )}
              </div>
            )}

            <>
              <input
                type="file"
                ref={coverFileInputRef}
                onChange={handleCoverFileChange}
                accept="image/*"
                className="hidden"
              />
              {/* Mobile Upload Icon */}
              <button
                type="button"
                onClick={handleCoverImageFileUploadClick}
                className="flex absolute top-2 right-2"
              >
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <EditIcon size={20} />
                </div>
              </button>
            </>

            <div className="absolute -bottom-12 w-full flex justify-center sm:justify-start sm:pl-6">
              <div className="relative">
                <input
                  type="file"
                  ref={avatarFileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {isLoading ? (
                  <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                    <Image
                      src={avatarPreviewUrl || (channel?.avatar as string)}
                      alt="Profile image"
                      width={1000}
                      height={1000}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="absolute bottom-0 right-1">
                  <button
                    type="button"
                    onClick={handleAvatarImageFileUploadClick}
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <EditIcon size={20} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16" />

          <div className="px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-36 sm:w-48 rounded" />
                    <Skeleton className="h-4 w-24 sm:w-36 rounded" />
                    <Skeleton className="h-4 w-24 sm:w-36 rounded" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg sm:text-2xl font-semibold">
                      {channel?.fullName}
                    </h2>
                    <div className="flex justify-center items-center gap-2">
                      <p className="text-sm sm:text-base text-white">
                        @{channel?.username}
                      </p>
                      <span className="text-sm sm:text-base text-gray-400">
                        •
                      </span>
                      <p className="text-sm sm:text-base text-gray-400">
                        {subscribers?.length ?? 0}{" "}
                        {subscribers?.length === 1
                          ? "Subscriber"
                          : "Subscribers"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isLoading ? (
                <Skeleton className="px-12 py-4 rounded-md" />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                  className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#1f1f1f] rounded-xl p-6 w-full flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-1 mt-4">
              {isLoading ? (
                <Skeleton className="rounded-md h-6 w-20" />
              ) : (
                <label className="text-neutralDivider">Full Name</label>
              )}

              {isLoading ? (
                <Skeleton className="rounded-md p-6" />
              ) : (
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="off"
                  placeholder="John Doe"
                  className={`${
                    isEditing
                      ? "bg-dark-50/20 cursor-not-allowed text-dark-50"
                      : "bg-transparent"
                  } rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                    touched.fullName && errors.fullName
                      ? "border-red-500"
                      : "border-dark-50"
                  }`}
                  value={values.fullName || channel?.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isEditing}
                />
              )}

              {touched.fullName && errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            <div className="flex flex-col gap-1 mt-4">
              {isLoading ? (
                <Skeleton className="rounded-md h-6 w-20" />
              ) : (
                <label className="text-neutralDivider">Username</label>
              )}

              {isLoading ? (
                <Skeleton className="rounded-md p-6" />
              ) : (
                <input
                  type="text"
                  name="username"
                  autoComplete="off"
                  placeholder="yourusername"
                  className={`${
                    isEditing
                      ? "bg-dark-50/20 cursor-not-allowed text-dark-50"
                      : "bg-transparent"
                  } rounded-md placeholder:text-dark-50 outline-none border p-3 ${
                    touched.username && errors.username
                      ? "border-red-500"
                      : "border-dark-50"
                  }`}
                  value={values.username || channel?.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isEditing}
                />
              )}

              {touched.username && errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-1 mt-4">
              {isLoading ? (
                <Skeleton className="rounded-md h-6 w-20" />
              ) : (
                <label className="text-neutralDivider">Email</label>
              )}

              {isLoading ? (
                <Skeleton className="rounded-md p-6" />
              ) : (
                <div className="bg-dark-50/20 text-dark-50   cursor-not-allowed rounded-md overflow-auto outline-none border p-3 border-dark-50">
                  {channel?.email}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl w-full flex justify-end gap-5">
          <button
            type="submit"
            className={`bg-logoRed active:bg-logoRed/60 w-full md:w-fit py-2 px-10 rounded-md text-base font-normal flex justify-center items-center`}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Save"}
          </button>
        </div>
      </form>
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps = authanticatedRoute;

export default MyProfile;
