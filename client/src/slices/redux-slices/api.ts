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

import { createApi, fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react"

const baseUrl = 
    import.meta.env.VITE_MODE === 'development'?
    import.meta.env.VITE_LOCAL_API_URL : 
    import.meta.env.VITE_API_URL 

// export const apiSlice = createApi({
//     reducerPath: "apiSlice",
//     baseQuery: fetchBaseQuery({
//         baseUrl: `${baseUrl}`,
//         prepareHeaders: (headers) => {
//             const accessToken = localStorage.getItem("accessToken");
//             // const refreshToken = localStorage.getItem("refreshToken");

//             if (accessToken) {
//                 headers.set("Authorization", `Bearer ${accessToken}`);
//             }
//             // if (refreshToken) {
//             //     headers.set("x-refresh-token", refreshToken);
//             // }
//             return headers;
//         },
//         responseHandler: async (response) => {
//             // pick up refreshed tokens
//             const newAccessToken = response.headers.get("x-access-token");
//             const newRefreshToken = response.headers.get("x-refresh-token");
//             if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);
//             if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

//             return response.json();
//         }
//     }),
//     tagTypes: ["Users", "Consultants", "TimeSlots", "Bookings"],
//     endpoints: () => ({})
// })

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    }
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result: any = await baseQuery(args, api, extraOptions);

    // if access token expired
    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) return result;

        // try refresh
        const refreshResult: any = await baseQuery(
            {
                url: "/auth/refresh",
                method: "POST",
                headers: {
                    "x-refresh-token": refreshToken
                }
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { accessToken, refreshToken: newRefreshToken } = refreshResult.data.data;

            // store new tokens
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            // retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // refresh failed → logout
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Users", "Consultants", "TimeSlots", "Bookings"],
    endpoints: () => ({})
});