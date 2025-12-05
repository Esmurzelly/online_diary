import { api } from "./api";
import { type User } from '@/types';
import { setToken, clearToken } from "@/features/auth/authSlice";
import { logout as StudentLogout } from "@/features/student/studentSlice";

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
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    
                    if(data.token) {
                        dispatch(setToken(data.token))
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            }
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
        }),

        getUserById: builder.query<User, string>({
            query: (id) => ({
                url: `/users/get-user-by-id/${id}`,
                method: "GET"
            })
        })
    })
});

export const {
    useSigninStudentMutation,
    useSignupStudentMutation,
    useCurrentQuery,
    useLazyCurrentQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,
    useSigninTeacherMutation,
    useSignupTeacherMutation,
    useSigninParentMutation,
    useSignupParentMutation
} = authApi;