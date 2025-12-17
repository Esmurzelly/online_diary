import { combineReducers } from "@reduxjs/toolkit";
import userReducer from '@/redux/user/userSlice';
import authReducer from '@/redux/auth/authSlice';
import schoolReducer from '@/redux/school/schoolSlice';
import classReducer from '@/redux/class/classSlice';
import studentReducer from '@/redux/student/studentSlice';
import teacherReducer from '@/redux/teacher/teacherSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    school: schoolReducer,
    class: classReducer,
    student: studentReducer,
    teacher: teacherReducer,
})

export type RootState = ReturnType<typeof rootReducer>