import React, { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/rootReducer';
import { registerUser } from '@/redux/user/userSlice';
import { toast } from 'react-toastify';
import { MdDriveFileRenameOutline, MdOutlineDriveFileRenameOutline } from "react-icons/md"; // name
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import FormField from '@/components/items/formField';

type Props = {
    role: 'student' | 'teacher' | 'parent' | 'admin' | 'none';
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
        if (role === 'none') {
            toast.info("Choose the role")
        }

        try {
            await dispatch(registerUser({
                email: data.email,
                name: data.name,
                password: data.password,
                surname: data.surname,
                role
            }))
        } catch (error) {
            console.log(`error in handleSubmit - ${error}`);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <form className='mt-5' onSubmit={handleSubmit(handleSubmitForm)}>
                <div className='flex flex-col'>
                    {role !== 'admin' &&
                        <div className='flex flex-col'>
                            <FormField
                                title='Name'
                                Icon={MdDriveFileRenameOutline}
                                inputType='text'
                                register={register}
                                registerName='name'
                                errorType={errors.name}
                            />

                            <FormField
                                title='Surname'
                                Icon={MdOutlineDriveFileRenameOutline}
                                inputType='text'
                                register={register}
                                registerName='surname'
                                errorType={errors.surname}
                            />
                        </div>
                    }

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

                <Button className='w-full mt-3! bg-primary-light text-primary-dark h-12' disabled={!role || role === undefined} type='submit'>Sign up</Button>
            </form>
        </div>
    )
}

export default RegisterComponent