import React, { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/rootReducer';
import { loginUser } from '@/redux/user/userSlice';
import { toast } from 'react-toastify'
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FormField from '@/components/items/formField';

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
            if (isAuth) navigate('/profile');
        } catch (error) {
            console.log(`error in useEffect - ${error}`)
        }
    }, [navigate, isAuth, message]);

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        if (role === 'none') {
            toast.info("Choose the role")
        }

        try {
            await dispatch(loginUser({ email: data.email, password: data.password, role }));
        } catch (error) {
            console.log(`error in handleSubmit - ${error}`);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <form className='' onSubmit={handleSubmit(handleSubmitForm)}>
                <div className='flex flex-col gap-3'>
                    <FormField
                        title='Email'
                        Icon={MdEmail}
                        inputType='email'
                        register={register}
                        registerName='email'
                        errorType={errors.email}
                    />

                    <FormField
                        title='Password'
                        Icon={TbLockPassword}
                        inputType='password'
                        register={register}
                        registerName='password'
                        errorType={errors.password}
                    />
                </div>

                <Button className='w-full mt-3! bg-primary-light text-primary-dark h-12' disabled={!role || role === undefined} type='submit'>Sign in</Button>
            </form>
        </div>
    )
}

export default LoginComponent