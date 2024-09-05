import Image from "next/image";
import logoImage from "../../public/images/logo.png";

const Logo = () => {
  return (
    <Image
      alt="Logo"
      className="w-[190px]"
      src={logoImage}
      height={1000}
      width={1000}
    />
  );
};

export default Logo;
