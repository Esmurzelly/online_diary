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
import { GoPlus } from "react-icons/go";
import { FaSchool } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import Loader from '@/components/items/Loader'

const School: React.FC = () => {
    const { schoolList, loading, message } = useSelector((state: RootState) => state.school);
    const [showSchools, setShowSchools] = useState(false);
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ISchool>();

    const onSubmit: SubmitHandler<ISchool> = async (data) => {
        try {
            await dispatch(createSchool(data)).unwrap();
            await dispatch(getAllSchools()).unwrap();
        } catch (error) {
            console.log(`error in onSubmit - ${error}`);
        }
    }

    useEffect(() => {
        if (message) toast(message);
    }, []);

    useEffect(() => {
        dispatch(getAllSchools());
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <div className='w-full p-5! pt-3!'>
            <h1 className='text-3xl font-medium'>Schools</h1>
            <p className='mt-1! text-sm'>Manage schools and institutions</p>

            <form className="bg-white rounded-2xl p-3! mt-3! shadow-xl" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <div className="">
                        <h1 className='flex items-center gap-1 font-medium text-xl'><GoPlus className='w-6 h-6 text-primary-light' /> Create New School</h1>
                        <p className='text-sm'>Add a new school to the system</p>
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-5">
                        <div className="flex flex-col">
                            <label htmlFor="title">Title:</label>
                            <input
                                {...register("title", { required: "title is required" })}
                                type="text"
                                id="title"
                                placeholder='Enter the title'
                                className='bg-white outline ml-2! p-2! rounded-lg'
                            />
                            {errors.title && <span className='text-red-600'>{errors.title.message}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className='text-left' htmlFor="email">Email:</label>
                            <input
                                {...register("email", { required: "email is required" })}
                                type="email"
                                id="email"
                                placeholder='school@example.edu'
                                className='bg-white outline ml-2! p-2! rounded-lg'
                            />
                            {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="address">Address:</label>
                            <input
                                {...register("address", { required: "address is required" })}
                                type="text"
                                id="address"
                                placeholder='Enter the address'
                                className='bg-white outline ml-2! p-2! rounded-lg'
                            />
                            {errors.address && <span className='text-red-600'>{errors.address.message}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phone">Phone:</label>
                            <input
                                {...register("phone", { required: "phone is required" })}
                                type="text"
                                id="phone"
                                placeholder='+7 964 058 38 74'
                                className='bg-white outline ml-2! p-2! rounded-lg'
                            />
                            {errors.phone && <span className='text-red-600'>{errors.phone.message}</span>}
                        </div>
                    </div>
                </div>

                <Button className='mt-4! w-[200px] bg-primary-light cursor-pointer text-primary-dark hover:bg-primary-light hover:scale-110' type='submit'>
                    <GoPlus className='w-6 h-6' />
                    <p>Create School</p>
                </Button>
            </form>

            {schoolList && schoolList?.length > 0
                ? <div className='mt-5!'>
                    <h1 className='flex items-center gap-1 font-medium text-xl'>All Schools ({schoolList.length})</h1>
                    <Button className='cursor-pointer px-2!' onClick={() => setShowSchools(state => !state)} variant={'outline'}>{showSchools ? "Hide" : "Show"} schools</Button>

                    {showSchools && <ul className='flex flex-col md:flex-row md:flex-wrap gap-2 items-start'>
                        {schoolList.map(schoolEl =>
                            <li key={schoolEl.id} className="w-full md:w-[250px] flex flex-col md:flex-wrap gap-3 bg-white rounded-2xl p-3! mt-3! shadow-xl">
                                <div className="flex items-center justify-between">
                                    <FaSchool className='text-primary-light w-6 h-6' />
                                    <Link className='hover:bg-primary-light p-1! rounded-sm' to={`/school/${schoolEl.id}`}><GoLinkExternal className='text-primary-dark w-4 h-4' /></Link>
                                </div>

                                <p className='font-semibold capitalize'>{schoolEl.title}</p>

                                <div className="flex items-center justify-start gap-2 text-primary-light">
                                    <MdEmail className='w-4 h-4' />
                                    <p className='text-sm'>{schoolEl.email}</p>
                                </div>

                                <div className="flex items-center justify-start gap-2 text-primary-light">
                                    <IoLocationSharp className='w-4 h-4' />
                                    <p className='text-sm'>{schoolEl.address}</p>
                                </div>

                                <div className="flex items-center justify-start gap-2 text-primary-light">
                                    <FaPhoneAlt className='w-4 h-4' />
                                    <p className='text-sm'>{schoolEl.phone}</p>
                                </div>

                                <Link className='mt-4! p-2! w-full rounded-lg bg-primary-light/25 hover:bg-primary-light transition delay-100 duration-300 ease-in-out text-primary-dark text-center' to={`/school/${schoolEl.id}`}>Go to School</Link>
                            </li>
                        )}
                    </ul>}
                </div>

                : <div className="flex items-center justify-center mt-5!">
                    <h1>No schools</h1>
                </div>
            }
        </div>
    )
}

export default School