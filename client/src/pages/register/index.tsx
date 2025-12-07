import React, { useEffect, useState } from 'react'
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import { Input } from "@/components/ui/input"
// import { useLazyCurrentQuery, useSigninStudentMutation } from '@/app/services/authApi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/rootReducer';
import { registerParent, registerStudent, registerTeacher } from '@/redux/user/userSlice';
import { toast } from 'react-toastify';


type Props = {
    role: 'student' | 'teacher' | 'parent' | 'admin';
}

type FormValues = {
    email: string;
    password: string;
    name: string;
    surname: string;
}

const RegisterComponent = ({ role }: Props) => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormValues>();

    const isAuth = useSelector((state: RootState) => state.auth.token);
    const message = useSelector((state: RootState) => state.user.message);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (message) toast(message);
            if (isAuth) navigate('/');
        } catch (error) {
            console.log(`error in useEffect - ${error}`)
        }
    }, [navigate, isAuth, message]);

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        console.log('data', data)
        try {
            if (role === 'student') {
                const res = await dispatch(registerStudent(data));
                console.log('res from handleSubmit - student', res);
                console.log(role);
            }
            if (role === 'teacher') {
                const res = await dispatch(registerTeacher(data));
                console.log('res from handleSubmit - teacher', res);
                console.log(role);

            }
            if (role === 'parent') {
                const res = await dispatch(registerParent(data));
                console.log('res from handleSubmit - parent', res);
                console.log(role);
            }
        } catch (error) {
            console.log(`error in handleSubmit - ${error}`);
        }
    }

    return (
        <>
            <form className='mt-5' onSubmit={handleSubmit(handleSubmitForm)}>
                <h1>Register</h1>

                <div className='flex flex-col'>
                    <label htmlFor="name">Name:</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        id="name"
                    />
                    {errors.name && <span>{errors.name.message}</span>}

                    <label htmlFor="surname">Surname:</label>
                    <input
                        {...register("surname", { required: "Surname is required" })}
                        type="text"
                        id="surname"
                    />
                    {errors.surname && <span>{errors.surname.message}</span>}

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
        </>
    )
}

export default RegisterComponent