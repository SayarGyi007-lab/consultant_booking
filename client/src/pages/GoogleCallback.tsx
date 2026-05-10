// pages/GoogleCallback.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLoginMutation } from "../slices/redux-slices/user-api";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/redux-slices/auth";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const called = useRef(false);  // prevents StrictMode double-fire

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    console.log("CODE:", code); // remove after confirming it works

    if (!code) {
      toast.error("Google login failed");
      navigate("/login");
      return;
    }

    googleLogin(code)
      .unwrap()
      .then((res) => {
        dispatch(setUserInfo(res.data));
        toast.success("Google login successful");
        if (res.data.requiresPhone) { navigate("/add-phone"); return; }
        if (res.data.role === "ADMIN") navigate("/admin");
        else navigate("/home");
      })
      .catch((err) => {
        console.log("ERROR:", err); // remove after confirming it works
        toast.error(err?.data?.message || "Google login failed");
        navigate("/login");
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
};

export default GoogleCallback;