import { useUser } from "@/contexts/auth";
import { useRouter } from "next/router";

// Define the types for Button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // Content inside the button (text, elements)
  className?: string; // Additional classes for styling
  disabled?: boolean; // Disable button state
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Optional onClick event handler
  task?: () => void; // Optional task to perform on button click when authenticated
}

const Button = ({
  children,
  className,
  disabled,
  onClick,
  task, // New prop for the task
  ...props
}: ButtonProps) => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!isAuthenticated) {
      router.push("/signin");
    } else {
      if (onClick) {
        onClick(e);
      }
    }
  };

  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
