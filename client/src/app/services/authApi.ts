import { api } from "./api";
import { type User } from '@/types';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signinStudent: builder.mutation<
            { token: string },
            { email: string, password: string }
        >({
            query: (userData) => ({
                url: "/auth/signin-student",
                method: "POST",
                body: userData
            })
        }),

        signupStudent: builder.mutation<
            { email: string; password: string; name: string },
            { email: string; password: string; name: string }
        >({
            query: (userData) => ({
                url: "/auth/signup-student",
                method: "POST",
                body: userData
            })
        }),

        signinTeacher: builder.mutation<
            { token: string },
            { email: string, password: string }
        >({
            query: (userData) => ({
                url: "/auth/signin-teaacher",
                method: "POST",
                body: userData
            })
        }),

        signupTeacher: builder.mutation<
            { email: string; password: string; name: string },
            { email: string; password: string; name: string }
        >({
            query: (userData) => ({
                url: "/auth/signup-teaacher",
                method: "POST",
                body: userData
            })
        }),

        signinParent: builder.mutation<
            { token: string },
            { email: string, password: string }
        >({
            query: (userData) => ({
                url: "/auth/signin-parent",
                method: "POST",
                body: userData
            })
        }),

        signupParent: builder.mutation<
            { email: string; password: string; name: string },
            { email: string; password: string; name: string }
        >({
            query: (userData) => ({
                url: "/auth/signup-parent",
                method: "POST",
                body: userData
            })
        }),

        current: builder.query<User, void>({
            query: () => ({
                url: "/users/get-me",
                method: "GET"
            })
        })
    })
});

export const {
    useSigninStudentMutation,
    useSignupStudentMutation
} = authApi;