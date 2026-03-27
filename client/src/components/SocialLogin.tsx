// components/GoogleButton.tsx
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "../slices/redux-slices/user-api";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/redux-slices/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleButton = () => {
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const idToken = credentialResponse.credential;

            const res = await googleLogin(idToken!).unwrap();

            dispatch(setUserInfo(res.data));

            toast.success("Google login successful");

            if (res.data.requiresPhone) {
              navigate("/add-phone");
              return;
            }

            if (res.data.role === "ADMIN") navigate("/admin");
            else navigate("/home");

          } catch (err: any) {
            toast.error(err?.data?.message || "Google login failed");
          }
        }}
        onError={() => {
          toast.error("Google login failed");
        }}
      />
    </div>
  );
};

export default GoogleButton;