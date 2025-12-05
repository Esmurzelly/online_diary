import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { useLazyCurrentQuery, useSigninStudentMutation } from '@/app/services/authApi';
import { useNavigate } from 'react-router-dom';

type Props = {}

type Login = {
    email: string;
    password: string;
}

const LoginComponent = (props: Props) => {
    const {
        handleSubmit,
        control,
        register,
        formState: { errors }
    } = useForm<Login>({
        mode: "onChange",
        reValidateMode: "onBlur",
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const [login, { isLoading }] = useSigninStudentMutation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [triggerCurrentQuery] = useLazyCurrentQuery();

    const onSubmit = async (data: Login) => {
        try {
            await login(data).unwrap();
            await triggerCurrentQuery().unwrap();
            navigate('/');
        } catch (error) {
            console.log('error in onSubmit in Login', error);
        }
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-2">
                <label htmlFor="">Email: </label>
                <input type="email" {...register("email", { required: true, maxLength: 20 })} />
                {errors.email?.types?.required && <p>This field is required</p>}
                {errors.email?.types?.maxLength && <p>Not more than 20 symbols</p>}
            </div>
            <div className="flex flex-row gap-2">
                <label htmlFor="">Password: </label>
                <input type="password" {...register("password", { required: true, maxLength: 20 })} />
                {errors.password?.types?.required && <p>This field is required</p>}
                {errors.password?.types?.maxLength && <p>Not more than 20 symbols</p>}
            </div>

            <input type="submit" />
        </form>
    )
}

export default LoginComponent