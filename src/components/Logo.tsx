import Image from "next/image";
import logoImage from "../../public/images/logo.png";
import { useRouter } from "next/router";
interface LogoProps {
  size?: number;
}
const Logo = ({ size = 190 }: LogoProps) => {
  const router = useRouter();
  return (
    <Image
      className="cursor-pointer"
      alt="Logo"
      style={{ width: size }}
      src={logoImage}
      height={1000}
      width={1000}
      onClick={() => {
        router.push("/");
      }}
    />
  );
};

export default Logo;
