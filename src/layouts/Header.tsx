import Logo from "@/components/Logo";
import Profile from "@/components/Profile";

const Header = () => {
  return (
    <div className="flex w-full items-center justify-between p-5 border-b border-dark-50">
      <Logo size={145} />
      <Profile />
    </div>
  );
};

export default Header;
