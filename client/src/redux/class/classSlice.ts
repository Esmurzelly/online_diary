import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";
import type { ISchool, ISubject, Student } from '@/types';

interface ClassItem {
    id: string;
    num: number | null;
    letter: string | null;
    schoolId: string | null;
    students: Student[] | null;
    subjects: ISubject[] | null;
    school: ISchool | null,
}

interface InitialState {
    classItem: ClassItem | null;
    classList: ClassItem[] | null;
    message: string | null;
    loading: boolean | null;
}

const initialState: InitialState = {
    classItem: null,
    classList: null,
    message: null,
    loading: false,
};

export const getClassById = createAsyncThunk(
    'class/getClassById',
    async ({ id }: { id: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/classes/get-class-by-id/${id}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getClassById" })

        }
    }
);

// export const studentsFromOneClass = createAsyncThunk(
//     'class/studentsFromOneClass',
//     async ({ classId }: { classId: string | undefined }, { rejectWithValue }) => {
//         try {
//             const { data } = await api.get(`${BASE_URL}/students/get-students-from-one-class`, {
//                 params: { classId }
//             }
//             );

//             console.log('data from redux', data)

//             return data;
//         } catch (error: any) {
//             return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })

//         }
//     }
// )

export const classSlice = createSlice({
    name: "class",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(getClassById.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getClassById.fulfilled, (state, action) => {
                state.loading = false;
                state.classItem = action.payload.classItem;
                state.message = action.payload.message;
            })
            .addCase(getClassById.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })

            // .addCase(studentsFromOneClass.pending, (state, action) => {
            //     state.loading = true;
            // })
            // .addCase(studentsFromOneClass.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.classItem!.students = action.payload.students;
            //     state.message = action.payload.message;
            // })
            // .addCase(studentsFromOneClass.rejected, (state, action) => {
            //     state.loading = false;
            //     state.message = action.payload.message;
            // })
});

export const { } = classSlice.actions;
export default classSlice.reducer;