import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";
import type { ISchool } from '@/types';

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

export const getAllSchools = createAsyncThunk(
    'school/getAllSchools',
    async (obj, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/schools/get-all-schools`, {
                data: obj
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllSchools" })

        }
    }
);

export const getSchoolById = createAsyncThunk(
    'school/getSchoolById',
    async ({ id }: { id: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/schools/get-school-by-id/${id}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllSchools" })

        }
    }
);

export const deleteClass = createAsyncThunk(
    'school/deleteClass',
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`${BASE_URL}/classes/remove-class`, {
                data: {
                    classId: id
                }
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllSchools" })
        }
    }
);

export const createSchool = createAsyncThunk(
    'school/createSchool',
    async (obj: ISchool, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${BASE_URL}/schools/create-school`, obj);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in createSchool" })
        }
    }
);

export const addClassToSchool = createAsyncThunk(
    'school/addClassToSchool',
    async ({ schoolId, num, letter }: { schoolId: string | undefined, num: number, letter: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE_URL}/schools/update-school-class`, {
                schoolId,
                num,
                letter
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in addClassToSchool" })
        }
    }
);

export const schoolSlice = createSlice({
    name: "school",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(getAllSchools.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllSchools.fulfilled, (state, action) => {
                state.loading = false;
                state.schoolList = action.payload.allSchools;
                state.message = action.payload.message;
            })
            .addCase(getAllSchools.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })

            .addCase(getSchoolById.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getSchoolById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSchool = action.payload.schoolById;
                state.message = action.payload.message;
            })
            .addCase(getSchoolById.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })

            .addCase(createSchool.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createSchool.fulfilled, (state, action) => {
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
                state.message = action.payload.message;
            })

            .addCase(addClassToSchool.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addClassToSchool.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSchool?.classes.push(action.payload.data);
                state.message = action.payload.message;
            })
            .addCase(addClassToSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })

            .addCase(deleteClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
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
                state.message = action.payload.message;
            })
});

export const { } = schoolSlice.actions;
export default schoolSlice.reducer;