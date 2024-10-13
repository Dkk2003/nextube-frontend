import Image from "next/image";
import { useUser } from "@/contexts/auth";
import Spinner from "./Spinner";

const Profile = () => {
  const { user, userLoading } = useUser();
  return (
    <div className="relative w-8 h-8 rounded-full cursor-pointer">
      <Image
        alt="Profile Image"
        className="rounded-full w-8 h-8 object-cover"
        src={user?.avatar ? user?.avatar : "/images/dummyProfileImage.webp"}
        height={1000}
        width={1000}
      />
      {userLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Profile;
