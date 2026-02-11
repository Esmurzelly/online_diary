import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";
import type { AddClassResponse, AddTeacherResponse, ApiError, CreateSchoolResponse, DeleteClassResponse, GetSchoolByIdResponse, IGetAllSchoolsAction, ISchool, RemoveTeacherResponse } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
    currentSchool: ISchool | null;
    schoolList: ISchool[] | null;
    message: string | null;
    loading: boolean | null;
}

const initialState: InitialState = {
    currentSchool: null,
    schoolList: null,
    message: null,
    loading: false,
};

export const getAllSchools = createAsyncThunk<IGetAllSchoolsAction, void, { rejectValue: ApiError }>(
    'school/getAllSchools',
    async (obj, { rejectWithValue }) => {
        try {
            const { data } = await api.get<IGetAllSchoolsAction>(`${BASE_URL}/schools/get-all-schools`, {
                data: obj
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllSchools" })

        }
    }
);

export const getSchoolById = createAsyncThunk<GetSchoolByIdResponse, { id: string }, { rejectValue: ApiError }>(
    'school/getSchoolById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetSchoolByIdResponse>(`${BASE_URL}/schools/get-school-by-id/${id}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getSchoolById" })

        }
    }
);

export const deleteClass = createAsyncThunk<DeleteClassResponse, { id: string }, { rejectValue: ApiError }>(
    'school/deleteClass',
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete<DeleteClassResponse>(`${BASE_URL}/classes/remove-class`, {
                data: {
                    classId: id
                }
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in deleteClass" })
        }
    }
);

export const createSchool = createAsyncThunk<CreateSchoolResponse, Omit<ISchool, 'id' | 'classes' | 'teachers'>, { rejectValue: ApiError }>(
    'school/createSchool',
    async (obj, { rejectWithValue }) => {
        try {
            const { data } = await api.post<CreateSchoolResponse>(`${BASE_URL}/schools/create-school`, obj);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in createSchool" })
        }
    }
);

export const addClassToSchool = createAsyncThunk<AddClassResponse, { schoolId: string; num: number; letter: string }, { rejectValue: ApiError }>(
    'school/addClassToSchool',
    async ({ schoolId, num, letter }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<AddClassResponse>(`${BASE_URL}/schools/update-school-class`, {
                schoolId,
                num,
                letter,
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in addClassToSchool" })
        }
    }
);

export const addTeacherToTheSchool = createAsyncThunk<AddTeacherResponse, { teacherId: string; schoolId: string }, { rejectValue: ApiError }>(
    'school/addTeacherToTheSchool',
    async ({ teacherId, schoolId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<AddTeacherResponse>(`${BASE_URL}/schools/update-school-teacher`, {
                teacherId,
                schoolId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in addTeacherToTheSchool" })

        }
    }
);

export const removeTeacherFromTheSchool = createAsyncThunk<RemoveTeacherResponse, { teacherId: string; schoolId: string }, { rejectValue: ApiError }>(
    'school/removeTeacherFromTheSchool',
    async ({ teacherId, schoolId }: { teacherId: string | undefined, schoolId: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<RemoveTeacherResponse>(`${BASE_URL}/schools/remove-teacher-from-school`, {
                teacherId,
                schoolId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeTeacherFromTheSchool" })
        }
    }
);

export const schoolSlice = createSlice({
    name: "school",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(getAllSchools.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllSchools.fulfilled, (state, action: PayloadAction<IGetAllSchoolsAction>) => {
                state.loading = false;
                state.schoolList = action.payload.allSchools;
                state.message = action.payload.message;
            })
            .addCase(getAllSchools.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(getSchoolById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSchoolById.fulfilled, (state, action: PayloadAction<GetSchoolByIdResponse>) => {
                state.loading = false;
                state.currentSchool = action.payload.schoolById;
                state.message = action.payload.message;
            })
            .addCase(getSchoolById.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(createSchool.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSchool.fulfilled, (state, action: PayloadAction<CreateSchoolResponse>) => {
                state.loading = false;
                if (Array.isArray(state.schoolList)) {
                    state.schoolList.push(action.payload.school)
                } else {
                    state.schoolList = [action.payload.school]
                }
                state.message = action.payload.message;
            })
            .addCase(createSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(addClassToSchool.pending, (state) => {
                state.loading = true;
            })
            .addCase(addClassToSchool.fulfilled, (state, action: PayloadAction<AddClassResponse>) => {
                state.loading = false;
                if (state.currentSchool) {
                    state.currentSchool.classes.push(action.payload.data);
                }
                state.message = action.payload.message;
            })
            .addCase(addClassToSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(deleteClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteClass.fulfilled, (state, action: PayloadAction<DeleteClassResponse>) => {
                state.loading = false;
                if (state.currentSchool?.classes) {
                    state.currentSchool!.classes = state.currentSchool!.classes.filter(
                        classEl => classEl.id !== action.payload.removedClass.id
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(addTeacherToTheSchool.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTeacherToTheSchool.fulfilled, (state, action: PayloadAction<AddTeacherResponse>) => {
                state.loading = false;
                state.currentSchool = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(addTeacherToTheSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(removeTeacherFromTheSchool.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeTeacherFromTheSchool.fulfilled, (state, action: PayloadAction<RemoveTeacherResponse>) => {
                state.loading = false;
                if (state.currentSchool?.teachers) {
                    state.currentSchool.teachers =
                        state.currentSchool.teachers.filter(
                            teacherItem => teacherItem.id !== action.payload.data.id
                        );
                }
                state.message = action.payload.message;
            })
            .addCase(removeTeacherFromTheSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })
});

export const { } = schoolSlice.actions;
export default schoolSlice.reducer;