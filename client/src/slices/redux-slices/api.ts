// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// const baseUrl = 
//     import.meta.env.VITE_MODE === 'development'?
//     import.meta.env.VITE_LOCAL_API_URL : 
//     import.meta.env.VITE_API_URL 

// export const apiSlice = createApi({
//     reducerPath: "apiSlice",
//     baseQuery: fetchBaseQuery({baseUrl: `${baseUrl}`, credentials: "include"}),
//     tagTypes: ["Users", "Consultants", "TimeSlots", "Bookings"],
//     endpoints:()=>({})
// })

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseUrl = 
    import.meta.env.VITE_MODE === 'development'?
    import.meta.env.VITE_LOCAL_API_URL : 
    import.meta.env.VITE_API_URL 

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}`,
        prepareHeaders: (headers) => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            if (refreshToken) {
                headers.set("x-refresh-token", refreshToken);
            }
            return headers;
        },
        responseHandler: async (response) => {
            // Pick up silently refreshed tokens
            const newAccessToken = response.headers.get("x-access-token");
            const newRefreshToken = response.headers.get("x-refresh-token");
            if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

            return response.json();
        }
    }),
    tagTypes: ["Users", "Consultants", "TimeSlots", "Bookings"],
    endpoints: () => ({})
})