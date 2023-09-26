import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://todoapp-api.onrender.com",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    }
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    // try the query
    let result = await baseQuery(args, api, extraOptions);
    // handle result
    if (result?.error?.status === 403) {
        console.log("sending refresh token");
        // send refresh token to get new access token
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
        if (refreshResult?.data) {
            // store the new access token
            api.dispatch(setCredentials({ ...refreshResult.data }));
            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "your login has expired";
            }

            return refreshResult;
        }
    }

    return result;
};

const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Note", "User"],
    endpoints: builder => ({})
});

export default apiSlice;