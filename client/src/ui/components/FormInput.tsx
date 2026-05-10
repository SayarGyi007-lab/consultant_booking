// import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   type?: string;
//   children?: React.ReactNode;
//   className?: string;
// }

// const FormInput = ({ label, type = "text", children, className = "", ...props }: Props) => {
//   return (
//     <div className="flex flex-col mb-4">
//       <label className="text-sm font-medium mb-1">{label}</label>

//       {type === "select" ? (
//         <select
//           {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
//           className={`w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black ${className}`}
//         >
//           {children}
//         </select>
//       ) : (
//         <input
//           {...props}
//           type={type}
//           className={`w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black ${className}`}
//         />
//       )}
//     </div>
//   )
// }

// export default FormInput

import React, { forwardRef } from "react"
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

type Props = {
  label: string
  type?: string
  children?: React.ReactNode
  className?: string
} & InputHTMLAttributes<HTMLInputElement>

type FormRef = HTMLInputElement | HTMLSelectElement

const FormInput = forwardRef<FormRef, Props>(
  ({ label, type = "text", children, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium mb-1">{label}</label>

        {type === "select" ? (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
            className={`w-full px-4 py-3 bg-[#d7e4ec] rounded-lg outline-none focus:ring-2 focus:ring-black/20 transition ${className}`}
          >
            {children}
          </select>
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...props}
            type={type}
            className={`w-full px-4 py-3 bg-[#d7e4ec] rounded-lg outline-none focus:ring-2 focus:ring-black/20 transition ${className}`}
          />
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"

export default FormInput