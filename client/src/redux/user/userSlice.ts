import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddParentToChildResponse, ApiError, AuthResponse, GetAllUsersResponse, GetMeResponse, GetUserByIdResponse, Parent, RemoveParentToChildResponse, RemoveUserResponse, Role, Student, Teacher, UpdateUserResponse, User } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "@/constants";
import { clearToken, setToken } from "../auth/authSlice";
import api from "@/utils/axios";

interface InitialState {
    users: Student[] | Teacher[] | Parent[] | null;
    currentUser: User | Student | null;
    message?: string | null;
    loading: boolean,
    role: Role | undefined | null,
}

const initialState: InitialState = {
    users: null,
    currentUser: null,
    message: null,
    loading: false,
    role: "none"
};

export const registerUser = createAsyncThunk<AuthResponse, { name: string; email: string; password: string; surname: string; role: string }, { rejectValue: ApiError }>(
    'user/registerStudent',
    async ({ name, email, password, surname, role }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post<AuthResponse>(`${BASE_URL}/auth/signup-${role}`, {
                name,
                email,
                password,
                surname
            });

            if (data) {
                dispatch(setToken(data.token));
            }

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Smth weng wrong in registerUser' })
        }
    }
);

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string; role: string }, { rejectValue: ApiError }>(
    'user/loginUser',
    async ({ email, password, role }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post<AuthResponse>(`${BASE_URL}/auth/signin-${role}`, {
                email,
                password
            });

            if (data.token) {
                dispatch(setToken(data.token));
            }

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in loginUser" })
        }
    }
);

export const googleAuth = createAsyncThunk<AuthResponse, { email: string | null; role: string; name: string | null; avatar: string | null }, { rejectValue: ApiError }>(
    'user/googleAuth',
    async ({ email, role, name, avatar }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post<AuthResponse>(`${BASE_URL}/auth/google-auth`, {
                email,
                role,
                name,
                avatar
            });

            if (data.token) {
                dispatch(setToken(data.token))
            };

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in googleAuth" })
        }
    }
)

export const getMe = createAsyncThunk<GetMeResponse, void, { rejectValue: ApiError }>(
    'user/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetMeResponse>(`${BASE_URL}/users/get-me`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getMe" })
        }
    }
);

export const getUserById = createAsyncThunk<GetUserByIdResponse, { id: string }, { rejectValue: ApiError }>(
    'user/getUserById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetUserByIdResponse>(`${BASE_URL}/users/get-user-by-id/${id}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getUserById" })
        }
    }
)

export const updateUser = createAsyncThunk<UpdateUserResponse, { formData: FormData; id: string; role: Role }, { rejectValue: ApiError }>(
    'user/updateUser',
    async ({ formData, id, role }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<UpdateUserResponse>(`${BASE_URL}/${role}s/update-${role}/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in updateUser" })
        }
    }
);

export const removeUser = createAsyncThunk<RemoveUserResponse, { id: string; role: string }, { rejectValue: ApiError }>(
    'user/removeUser',
    async ({ id, role }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.delete<RemoveUserResponse>(`${BASE_URL}/${role}s/delete-${role}/${id}`);
            dispatch(clearToken());

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const removeUserByAdmin = createAsyncThunk<RemoveUserResponse, { id: string }, { rejectValue: ApiError }>(
    'user/removeUserById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete<RemoveUserResponse>(`${BASE_URL}/users/remove-user`, {
                data: {
                    id
                }
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUserByAdmin" })
        }
    }
)

export const getAllUsers = createAsyncThunk<GetAllUsersResponse, void, { rejectValue: ApiError }>(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetAllUsersResponse>(`${BASE_URL}/users/get-all-users`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllUsers" })
        }
    }
);

export const addParentToChild = createAsyncThunk<AddParentToChildResponse, { parentId: string; studentId: string }, { rejectValue: ApiError }>(
    'user/addParentToChild',
    async ({ parentId, studentId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<AddParentToChildResponse>(`${BASE_URL}/parents/add-parent-to-child`, {
                parentId,
                studentId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in addParentToChild" })
        }
    }
);

export const removeParentToChild = createAsyncThunk<RemoveParentToChildResponse, { parentId: string; studentId: string }, { rejectValue: ApiError }>(
    'user/removeParentToChild',
    async ({ parentId, studentId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<RemoveParentToChildResponse>(`${BASE_URL}/parents/remove-parent-from-child`, {
                parentId,
                studentId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeParentToChild" })
        }
    }
)

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.message = null;
            state.role = 'none'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.currentUser = action.payload.user;
                state.loading = false;
                state.message = action.payload.message;
                state.role = action.payload.role;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
                state.role = action.payload.role;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(googleAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(googleAuth.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                if (state.users) {
                    // @ts-ignore
                    state.users.push(action.payload.user);
                }
                state.loading = false;
                state.role = action.payload.role;
            })
            .addCase(googleAuth.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action: PayloadAction<GetMeResponse>) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(getUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserById.fulfilled, (state, action: PayloadAction<GetUserByIdResponse>) => {
                state.message = action.payload.message;
                state.loading = false;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<UpdateUserResponse>) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(removeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<RemoveUserResponse>) => {
                state.message = action.payload.message;
                state.currentUser = null;
                state.loading = false;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(removeUserByAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUserByAdmin.fulfilled, (state, action: PayloadAction<RemoveUserResponse>) => {
                state.message = action.payload.message;
                state.loading = false;
            })
            .addCase(removeUserByAdmin.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<GetAllUsersResponse>) => {
                state.message = action.payload.message;
                state.users = action.payload.users;
                state.loading = false;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(addParentToChild.pending, (state) => {
                state.loading = true;
            })
            .addCase(addParentToChild.fulfilled, (state, action: PayloadAction<AddParentToChildResponse>) => {
                state.message = action.payload.message;

                if (state.currentUser && state.role === 'parent') {
                    const parent = state.currentUser as Parent;

                    parent.childrenIds = [...(parent.childrenIds || []), ...action.payload.result.childrenIds];
                    parent.children = action.payload.result.children

                    // state.currentUser.childrenIds.push(action.payload.result.childrenIds); // ? state.currentUser.childrenIds = action.payload.result.childrenIds
                    // state.currentUser.children = action.payload.result.children;
                }
                state.loading = false;
            })
            .addCase(addParentToChild.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })

            .addCase(removeParentToChild.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeParentToChild.fulfilled, (state, action: PayloadAction<RemoveParentToChildResponse>) => {
                state.message = action.payload.message;

                if (state.currentUser && state.role === 'parent') {
                    const parent = state.currentUser as Parent;

                    parent.childrenIds = (parent.childrenIds || []).filter(childId => childId !== action.payload.parentToChild.id);
                    parent.children = action.payload.parentToChild.children;

                    // state.currentUser.childrenIds.filter(childrenIdsItem => childrenIdsItem !== action.payload.parentToChild.id);
                    // state.currentUser.children = action.payload.parentToChild.children;
                }
                state.loading = false;
            })
            .addCase(removeParentToChild.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message
            })
    }
});

export const { logOut } = userSlice.actions;
export default userSlice.reducer;