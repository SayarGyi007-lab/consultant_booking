// import { GoogleLogin } from "@react-oauth/google";
// import { useGoogleLoginMutation } from "../slices/redux-slices/user-api";
// import { useDispatch } from "react-redux";
// import { setUserInfo } from "../slices/redux-slices/auth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const GoogleButton = () => {
//   const [googleLogin] = useGoogleLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   return (
//     <div className="flex justify-center">
//       <GoogleLogin
//         onSuccess={async (credentialResponse) => {
//           try {
//             const idToken = credentialResponse.credential;

//             const res = await googleLogin(idToken!).unwrap();

//             dispatch(setUserInfo(res.data));

//             toast.success("Google login successful");

//             if (res.data.requiresPhone) {
//               navigate("/add-phone");
//               return;
//             }

//             if (res.data.role === "ADMIN") navigate("/admin");
//             else navigate("/home");

//           } catch (err: any) {
//             toast.error(err?.data?.message || "Google login failed");
//           }
//         }}
//         onError={() => {
//           toast.error("Google login failed");
//         }}
//       />
//     </div>
//   );
// };

// export default GoogleButton;

// import { GoogleLogin } from "@react-oauth/google";
// import { useGoogleLoginMutation } from "../slices/redux-slices/user-api";
// import { useDispatch } from "react-redux";
// import { setUserInfo } from "../slices/redux-slices/auth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const GoogleButton = () => {
//   const [googleLogin] = useGoogleLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

//   return (
//     <div className="flex justify-center">
//       <GoogleLogin
//         onSuccess={async (credentialResponse) => {
//           try {
//             const idToken = credentialResponse.credential;

//             if (!idToken) {
//               toast.error("Google token missing");
//               return;
//             }

//             const res = await googleLogin(idToken).unwrap();

//             dispatch(setUserInfo(res.data));

//             toast.success("Google login successful");

//             if (res.data.requiresPhone) {
//               navigate("/add-phone");
//               return;
//             }

//             if (res.data.role === "ADMIN") navigate("/admin");
//             else navigate("/home");

//           } catch (err: any) {
//             toast.error(err?.data?.message || "Google login failed");
//           }
//         }}
//         onError={() => {
//           toast.error("Google login failed");
//         }}
//       />
//     </div>
//   );
// };

// export default GoogleButton;


import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "../slices/redux-slices/user-api";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/redux-slices/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleButton = () => {
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await googleLogin(codeResponse.code).unwrap();
        dispatch(setUserInfo(res.data));
        toast.success("Google login successful");
        if (res.data.requiresPhone) { navigate("/add-phone"); return; }
        if (res.data.role === "ADMIN") navigate("/admin");
        else navigate("/home");
      } catch (err: any) {
        toast.error(err?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <div className="flex justify-center">
      <button
        onClick={() => login()}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-sm transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleButton;