import apiSlice from "../../app/api/apiSlice";
import { logout, setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: "/auth",
                method: "POST",
                body: { ...credentials }
            })
        }),
        signout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.error(err);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: "GET"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken } = data;
                    dispatch(setCredentials({ accessToken }));
                } catch (err) {
                    console.error(err);
                }
            }
        })
    })
});

export const {
    useLoginMutation,
    useSignoutMutation,
    useRefreshMutation
} = authApiSlice;