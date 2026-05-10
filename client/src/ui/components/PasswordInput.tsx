import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const PasswordInput = ({ label, className = "", ...props }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium mb-1">{label}</label>

      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`w-full px-4 py-3 bg-[#d7e4ec] rounded-lg outline-none focus:ring-2 focus:ring-black/20 transition ${className}`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;