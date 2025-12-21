// import { createSlice } from "@reduxjs/toolkit";
// import api from "@/utils/axios";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { BASE_URL } from "@/constants";
// import type { ISubject, Teacher } from "@/types";

// interface InitialState {
//     subjectsList: ISubject[] | null;
//     currentSubject: ISubject | null;
//     message?: string | null;
//     loading: boolean,
// }

// const initialState: InitialState = {
//     subjectsList: null,
//     currentSubject: null,
//     message: null,
//     loading: false,
// };

// export const getAllSubjectsByTeacher = createAsyncThunk(
//     'subjects/getAllSubjects',
//     async() => {

//     }
// );

// // export const getCurrentSubject = createAsyncThunk(
// //     'subjects/getAllSubjects',
// //     async() => {

// //     }
// // );

// export const subjectSlice = createSlice({
//     name: "subjects",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             // .addCase
//     }
// });

// export const { } = subjectSlice.actions;
// export default subjectSlice.reducer;