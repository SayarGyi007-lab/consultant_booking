import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  children?: React.ReactNode;
  className?: string;
}

const FormInput = ({ label, type = "text", children, className = "", ...props }: Props) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium mb-1">{label}</label>

      {type === "select" ? (
        <select
          {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
          className={`w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        >
          {children}
        </select>
      ) : (
        <input
          {...props}
          type={type}
          className={`w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        />
      )}
    </div>
  )
}

export default FormInput