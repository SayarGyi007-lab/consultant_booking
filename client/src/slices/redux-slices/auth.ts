import { createSlice } from "@reduxjs/toolkit"

interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: "ADMIN" | "USER"
}

interface AuthSlice{
    userInfo: UserInfo | null
}

// const initialState : AuthSlice = {
//     userInfo: localStorage.getItem("userInfo")? 
//     JSON.parse(localStorage.getItem("userInfo")as string) : null
// }

const parseLocalStorage = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        localStorage.removeItem(key); // clear corrupted data
        return null;
    }
}

const initialState: AuthSlice = {
    userInfo: parseLocalStorage<UserInfo>("userInfo")
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    // reducers:{
    //     setUserInfo:(state, action)=>{
    //         state.userInfo = action.payload;
    //         localStorage.setItem("userInfo",JSON.stringify(action.payload))
    //     },
    //     clearUserInfo:(state)=>{
    //         state.userInfo = null;
    //         localStorage.removeItem("userInfo")
    //     }
    // }
    reducers: {
    setUserInfo: (state, action) => {
        const { accessToken, refreshToken, ...user } = action.payload;
        state.userInfo = user;
        localStorage.setItem("userInfo", JSON.stringify(user));
   
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    },
    clearUserInfo: (state) => {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("accessToken");   // 👈 clear tokens on logout
        localStorage.removeItem("refreshToken");
    }
}
})

export const {setUserInfo, clearUserInfo} = authSlice.actions
export default authSlice.reducer

