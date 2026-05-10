import React from "react";

interface Props {
  children: React.ReactNode;
  error?: string;
}

const FormField = ({ children, error }: Props) => {
  return (
    <div>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;