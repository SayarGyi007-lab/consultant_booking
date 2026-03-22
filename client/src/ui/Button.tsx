import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "common" | "uncommon" | "danger" | "success";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  size = "md",
}: ButtonProps) => {

  const base = "flex items-center justify-center gap-2 rounded-lg transition-colors";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };

  const styles = {
    primary: "bg-black text-white hover:opacity-80",
    outline: "border border-gray-300 hover:bg-gray-100",
    secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600",
    common: "bg-indigo-600 text-white hover:bg-indigo-700",
    uncommon: "bg-gray-100 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${styles[variant]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

export default Button