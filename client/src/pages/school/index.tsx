import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { RootState } from '@/redux/rootReducer'
import { useAppDispatch } from '@/redux/store'
import type { ISchool } from '@/types'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createSchool, getAllSchools } from '@/redux/school/schoolSlice'
import { Link } from 'react-router-dom'

type Props = {}

const School = (props: Props) => {
    const [showSchools, setShowSchools] = useState(false);
    const dispatch = useAppDispatch();

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm<ISchool>();

    const onSubmit: SubmitHandler<ISchool> = async (data) => {
        try {
            const res = await dispatch(createSchool(data));
            console.log('res from onSubmit', res);

            dispatch(getAllSchools());
        } catch (error) {
            console.log(`error in onSubmit - ${error}`);
        }
    }

    const { loading, message, schoolList } = useSelector((state: RootState) => state.school);

    useEffect(() => {
        if (message) toast(message);
    }, [message]);
    
    useEffect(() => {
        dispatch(getAllSchools());
    }, []);
    
    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className='w-scree'>
            <h1>School</h1>

            <form className='' onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-end bg-gray-400 p-4">
                    <div className="">
                        <label htmlFor="title">Title:</label>
                        <input
                            {...register("title", { required: "title is required" })}
                            type="text"
                            id="title"
                            className='bg-white outline'
                        />
                        {errors.title && <span>{errors.title.message}</span>}
                    </div>

                    <div className="">
                        <label className='text-left' htmlFor="email">Email:</label>
                        <input
                            {...register("email", { required: "email is required" })}
                            type="email"
                            id="email"
                            className='bg-white outline'
                        />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>

                    <div className="">
                        <label htmlFor="title">Address:</label>
                        <input
                            {...register("address", { required: "address is required" })}
                            type="text"
                            id="address"
                            className='bg-white outline'
                        />
                        {errors.address && <span>{errors.address.message}</span>}
                    </div>

                    <div className="">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            {...register("phone", { required: "phone is required" })}
                            type="text"
                            id="phone"
                            className='bg-white outline'
                        />
                        {errors.phone && <span>{errors.phone.message}</span>}
                    </div>
                </div>

                <input type="submit" value="Create" />
            </form>

            {
                schoolList && schoolList?.length
                    ? <>
                        <h1>School List</h1>
                        <Button onClick={() => setShowSchools(state => !state)} variant={'outline'}>Show schools</Button>

                    <ul className='flex flex-col gap-2 items-start'>
                        {showSchools && schoolList.map(schoolEl =>
                            <li key={schoolEl.id}>
                                <p>title: {schoolEl.title}</p>
                                <p>email: {schoolEl.email}</p>
                                <p>address: {schoolEl.address}</p>
                                <p>phone: {schoolEl.phone}</p>
                                <p>classes: {schoolEl.classes.length}</p>
                                <Link to={`/school/${schoolEl.id}`}>Go to the school</Link>
                            </li>)}
                    </ul>
                        
                    </>
                    : <div className="flex items-center justify-center">
                        <h1>No schools</h1>
                    </div>
            }
        </div>
    )
}

export default School