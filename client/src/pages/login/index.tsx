import React, { useEffect, useState } from 'react'
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import { Input } from "@/components/ui/input"
// import { useLazyCurrentQuery, useSigninStudentMutation } from '@/app/services/authApi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/rootReducer';
import { loginStudent } from '@/redux/user/studentSlice';

type Props = {}

type FormValues = {
    email: string;
    password: string;
}

const LoginComponent = (props: Props) => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormValues>();

    const isAuth = useSelector((state: RootState) => state.auth.token);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (isAuth) navigate('/');
        } catch (error) {
            console.log(`error in useEffect - ${error}`)
        }
    }, [navigate, isAuth]);

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        try {
            const res = await dispatch(loginStudent(data));

            console.log('res from handleSubmit', res);
        } catch (error) {
            console.log(`error in handleSubmit - ${error}`);
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
            <h1>Login</h1>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    id="email"
                />
                {errors.email && <span>{errors.email.message}</span>}

                <label htmlFor="password">Password:</label>
                <input
                    {...register("password", { required: "Password is required" })}
                    type="password"
                    id="password"
                />
                {errors.password && <span>{errors.password.message}</span>}
            </div>

            <input type="submit" />
        </form>
    )
}

export default LoginComponent