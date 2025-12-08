import React, { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/rootReducer';
import { loginParent, loginStudent, loginTeacher } from '@/redux/user/userSlice';
import { toast } from 'react-toastify'

type Props = {
    role: 'none' | 'student' | 'teacher' | 'parent' | 'admin';
}

type FormValues = {
    email: string;
    password: string;
}

const LoginComponent = ({ role }: Props) => {
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
        try {
            switch (role) {
                case 'student':
                    await dispatch(loginStudent(data));
                    break;
                case 'teacher':
                    await dispatch(loginTeacher(data));
                    break;
                case 'parent':
                    await dispatch(loginParent(data));
                    break;
                default:
                    return toast.error("Choose the role")
            }
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

            <input disabled={role === undefined || !role} type="submit" />
        </form>
    )
}

export default LoginComponent