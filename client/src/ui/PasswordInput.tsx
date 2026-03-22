import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const PasswordInput = ({ label, ...props }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="relative mt-1">

        <input
          {...props}
          type={show ? "text" : "password"}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-3 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

      </div>
    </div>
  );
}

export default PasswordInput