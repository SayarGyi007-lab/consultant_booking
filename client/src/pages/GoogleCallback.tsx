// pages/GoogleCallback.tsx
import { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    // @react-oauth/google handles the code extraction automatically
    // This page just needs to exist — the library does the rest
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
};

export default GoogleCallback;