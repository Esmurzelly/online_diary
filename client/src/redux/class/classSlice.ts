import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";
import type { AddStudentToClassResponse, AddSubjectToClassResponse, AddTeacherToSubjectResponse, ApiError, ClassItem, EditClassResponse, GetClassByIdResponse, RemoveStudentFromClassResponse, RemoveSubjectFromClassResponse, RemoveTeacherFromSubjectResponse, StudentsFromOneClassResponse } from '@/types';

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

export const getClassById = createAsyncThunk<GetClassByIdResponse, { id: string }, { rejectValue: ApiError }>(
    'class/getClassById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetClassByIdResponse>(`${BASE_URL}/classes/get-class-by-id/${id}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getClassById" })

        }
    }
);

export const addStudentToTheClass = createAsyncThunk<AddStudentToClassResponse, { studentId: string; classId: string }, { rejectValue: ApiError }>(
    'class/addStudentToTheClass',
    async ({ studentId, classId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<AddStudentToClassResponse>(`${BASE_URL}/students/add-student-to-class`, {
                studentId,
                classId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const removeStudentFromTheClass = createAsyncThunk<RemoveStudentFromClassResponse, { studentId: string; classId: string }, { rejectValue: ApiError }>(
    'class/removeStudentToTheClass',
    async ({ studentId, classId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<RemoveStudentFromClassResponse>(`${BASE_URL}/students/remove-student-from-class`, {
                studentId,
                classId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const studentsFromOneClass = createAsyncThunk<StudentsFromOneClassResponse, { classId: string }, { rejectValue: ApiError }>(
    'class/studentsFromOneClass',
    async ({ classId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get<StudentsFromOneClassResponse>(`${BASE_URL}/students/get-students-from-one-class`, {
                params: { classId }
            }
            );

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })

        }
    }
);

export const addSubjectToTheClass = createAsyncThunk<AddSubjectToClassResponse, { title: string; classId: string }, { rejectValue: ApiError }>(
    'class/addSubjectToTheClass',
    async ({ title, classId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<AddSubjectToClassResponse>(`${BASE_URL}/subjects/create-new-subject`, {
                title,
                classId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })
        }
    }
);

export const removeSubjectFromTheClass = createAsyncThunk<RemoveSubjectFromClassResponse, { subjectId: string }, { rejectValue: ApiError }>(
    'class/removeSubjectFromTheClass',
    async ({ subjectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete<RemoveSubjectFromClassResponse>(`${BASE_URL}/subjects/delete-subject`, {
                data: {
                    subjectId
                }
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })
        }
    }
);

export const addTeacherToSubject = createAsyncThunk<AddTeacherToSubjectResponse, { teacherId: string; subjectId: string }, { rejectValue: ApiError }>(
    'class/addTeacherToSubject',
    async ({ teacherId, subjectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<AddTeacherToSubjectResponse>(`${BASE_URL}/subjects/teacher-to-subject`, {
                teacherId,
                subjectId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })
        }
    }
);

export const removeTeacherFromTheSubject = createAsyncThunk<RemoveTeacherFromSubjectResponse, { teacherId: string; subjectId: string }, { rejectValue: ApiError }>(
    'class/removeTeacherFromTheSubject',
    async ({ teacherId, subjectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<RemoveTeacherFromSubjectResponse>(`${BASE_URL}/subjects/delete-teacher-from-subject`, {
                teacherId,
                subjectId
            });


            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })
        }
    }
);

export const editClass = createAsyncThunk<EditClassResponse, { classId: string; num?: number | null; letter?: string | null }, { rejectValue: ApiError }>(
    'class/editClass',
    async ({ classId, num, letter }, { rejectWithValue }) => {
        try {
            const { data } = await api.put<EditClassResponse>(`${BASE_URL}/classes/edit-class`, {
                classId,
                num,
                letter
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })
        }
    }
)

export const classSlice = createSlice({
    name: "class",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(getClassById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClassById.fulfilled, (state, action: PayloadAction<GetClassByIdResponse>) => {
                state.loading = false;
                state.classItem = action.payload.classItem;
                state.message = action.payload.message;
            })
            .addCase(getClassById.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(addStudentToTheClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(addStudentToTheClass.fulfilled, (state, action: PayloadAction<AddStudentToClassResponse>) => {
                state.loading = false;

                if (Array.isArray(state.classItem?.students)) {
                    state.classItem?.students?.push(action.payload.student);
                } else {
                    if (state.classItem) {
                        state.classItem.students = [action.payload.student]
                    }
                }
                state.message = action.payload.message;
            })
            .addCase(addStudentToTheClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(removeStudentFromTheClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeStudentFromTheClass.fulfilled, (state, action: PayloadAction<RemoveStudentFromClassResponse>) => {
                state.loading = false;
                if (state.classItem?.students) {
                    state.classItem.students = state.classItem?.students?.filter(
                        studentItem => studentItem.id !== action.payload.student.id
                    );
                }

                state.message = action.payload.message;
            })
            .addCase(removeStudentFromTheClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(studentsFromOneClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(studentsFromOneClass.fulfilled, (state, action: PayloadAction<StudentsFromOneClassResponse>) => {
                state.loading = false;
                if (state.classItem) {
                    state.classItem.students = action.payload.students;
                }
                state.message = action.payload.message;
            })
            .addCase(studentsFromOneClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(addSubjectToTheClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSubjectToTheClass.fulfilled, (state, action: PayloadAction<AddSubjectToClassResponse>) => {
                state.loading = false;
                
                if (Array.isArray(state.classItem?.subjects)) {
                    state.classItem.subjects?.push(action.payload.subject);
                } else {
                    state.classItem!.subjects = [action.payload.subject];
                }
                state.message = action.payload?.message || null;
            })
            .addCase(addSubjectToTheClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(removeSubjectFromTheClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeSubjectFromTheClass.fulfilled, (state, action: PayloadAction<RemoveSubjectFromClassResponse>) => {
                state.loading = false;
                if(state.classItem?.subjects) {
                    state.classItem.subjects = state.classItem?.subjects?.filter(subjectItem => subjectItem.id !== action.payload.subject.id);
                }
                state.message = action.payload.message;
            })
            .addCase(removeSubjectFromTheClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })

            .addCase(editClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(editClass.fulfilled, (state, action: PayloadAction<EditClassResponse>) => {
                state.loading = false;
                state.classItem = action.payload.editedClass;
                state.message = action.payload.message;
            })
            .addCase(editClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || null;
            })
});

export default classSlice.reducer;