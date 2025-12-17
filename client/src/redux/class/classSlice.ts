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

export const addStudentToTheClass = createAsyncThunk(
    'class/addStudentToTheClass',
    async ({ studentId, classId }: { studentId: string, classId: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE_URL}/students/add-student-to-class`, {
                studentId,
                classId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const removeStudentFromTheClass = createAsyncThunk(
    'class/removeStudentToTheClass',
    async ({ studentId, classId }: { studentId: string, classId: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE_URL}/students/remove-student-from-class`, {
                studentId,
                classId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const studentsFromOneClass = createAsyncThunk(
    'class/studentsFromOneClass',
    async ({ classId }: { classId: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/students/get-students-from-one-class`, {
                params: { classId }
            }
            );

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })

        }
    }
);

export const addSubjectToTheClass = createAsyncThunk(
    'class/addSubjectToTheClass',
    async ({ title, classId }: { title: string | undefined, classId: string | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE_URL}/subjects/create-new-subject`, {
                title,
                classId
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in studentsFromOneClass" })
        }
    }
);

export const removeSubjectFromTheClass = createAsyncThunk(
    'class/removeSubjectFromTheClass',
    async ({ subjectId }: { subjectId: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`${BASE_URL}/subjects/delete-subject`, {
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

export const addTeacherToSubject = createAsyncThunk(
    'class/addTeacherToSubject',
    async({ teacherId, subjectId }: { teacherId: string, subjectId: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE_URL}/subjects/teacher-to-subject`, {
                teacherId,
                subjectId
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

            .addCase(addStudentToTheClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addStudentToTheClass.fulfilled, (state, action) => {
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
                state.message = action.payload.message;
            })

            .addCase(removeStudentFromTheClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(removeStudentFromTheClass.fulfilled, (state, action) => {
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
                state.message = action.payload.message;
            })

            .addCase(studentsFromOneClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(studentsFromOneClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classItem!.students = action.payload.students;
                state.message = action.payload.message;
            })
            .addCase(studentsFromOneClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })

            .addCase(addSubjectToTheClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addSubjectToTheClass.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.classItem!.subjects)) {
                    state.classItem!.subjects?.push(action.payload.subject);
                } else {
                    state.classItem!.subjects = [action.payload.subject];
                }
                state.message = action.payload.message;
            })
            .addCase(addSubjectToTheClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            
            .addCase(removeSubjectFromTheClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(removeSubjectFromTheClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classItem!.subjects = state.classItem?.subjects?.filter(subjectItem => subjectItem.id !==  action.payload.subject.id);
                state.message = action.payload.message;
            })
            .addCase(removeSubjectFromTheClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })

            .addCase(addTeacherToSubject.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addTeacherToSubject.fulfilled, (state, action) => {
                state.loading = false;
                // ? sta
                console.log('action.payload in addTeacherToSubject in classSlice - extraRedux', action.payload);
                state.message = action.payload.message;
            })
            .addCase(addTeacherToSubject.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
});

export const { } = classSlice.actions;
export default classSlice.reducer;