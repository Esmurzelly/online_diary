import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RootState } from '@/redux/rootReducer';
import { addClassToSchool, addTeacherToTheSchool, deleteClass, getSchoolById, removeTeacherFromTheSchool } from '@/redux/school/schoolSlice';
import { useAppDispatch } from '@/redux/store';
import { getAllTeachers } from '@/redux/teacher/teacherSlice';
import type { ISchool } from '@/types';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { FaPhoneAlt, FaSchool, FaTrashAlt } from "react-icons/fa";
import { GoLinkExternal, GoPlus } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { SiGoogleclassroom } from 'react-icons/si';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GiTeacher } from 'react-icons/gi';

type Props = {}

const SchoolId = (props: Props) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [showClasses, setShowClasses] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>();
    const { teacherList } = useSelector((state: RootState) => state.teacher);
    const { loading, message, currentSchool } = useSelector((state: RootState) => state.school);
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors }
    } = useForm<{ num: number, letter: string }>();

    useEffect(() => {
        dispatch(getSchoolById({ id }));
        dispatch(getAllTeachers());
    }, []);

    useEffect(() => {
        if (message) toast.info(message);
    }, [message]);

    const handleAddClassToSchool = async (data: { num: number, letter: string }) => {
        try {
            const res = await dispatch(addClassToSchool({
                letter: data.letter,
                num: Number(data.num),
                schoolId: currentSchool?.id
            }));

            resetField("letter");
            resetField("num");

            dispatch(getSchoolById({ id }));
        } catch (error) {
            console.log(`error in onSubmit - ${error}`);
        }
    }

    const handleDeleteClass = async ({ id }: { id: string }) => {
        try {
            await dispatch(deleteClass({ id }));
            dispatch(getSchoolById({ id: currentSchool?.id }));
        } catch (error) {
            console.log(`error in onSubmit - ${error}`);
        }
    }

    const handleTeacherChange = (teacherId: string) => {
        setSelectedTeacher(teacherId);
    };

    const handleAddTeacher = async () => {
        if (selectedTeacher) {
            await dispatch(addTeacherToTheSchool({ teacherId: selectedTeacher, schoolId: id }))
            dispatch(getSchoolById({ id: currentSchool?.id }));
            setSelectedTeacher(null);
        }
    };

    const handleRemoveTeacherFromSchool = async (teacherId: string) => {
        try {
            const res = await dispatch(removeTeacherFromTheSchool({ schoolId: id, teacherId })).unwrap();
            console.log('res from handleRemoveTeacherFromSchool - client func', res);
            dispatch(getSchoolById({ id: currentSchool?.id }));
            setSelectedTeacher(null);

        } catch (error) {
            console.log('error in handleRemoveTeacherFromSchool', error)
        }
    }

    if (loading) {
        <h1>Loading...</h1>
    }

    return (
        <div className='w-full p-5! pt-3!'>
            <div className="w-full grid grid-cols-2 grid-rows-2 bg-secondary-dark text-white p-3! rounded-2xl">
                <div className="flex items-center justify-between md:justify-start md:gap-3">
                    <FaSchool className='w-12 h-12' />
                    <h1 className='col-span-1 text-4xl capitalize'>{currentSchool?.title}</h1>
                </div>

                <div className="col-start-1 row-start-2 flex flex-col md:flex-row md:justify-between gap-2">
                    <div className="flex items-center justify-start gap-3 text-primary-light">
                        <MdEmail className='w-4 h-4' />
                        <p className='text-sm'>{currentSchool.email}</p>
                    </div>

                    <div className="flex items-center justify-start gap-3 text-primary-light">
                        <IoLocationSharp className='w-4 h-4' />
                        <p className='text-sm'>{currentSchool.address}</p>
                    </div>

                    <div className="flex items-center justify-start gap-3 text-primary-light">
                        <FaPhoneAlt className='w-4 h-4' />
                        <p className='text-sm'>{currentSchool.phone}</p>
                    </div>
                </div>
            </div>

            <form className="bg-white rounded-2xl p-3! mt-3! shadow-xl" onSubmit={handleSubmit(handleAddClassToSchool)}>
                <div className="flex flex-col gap-2">
                    <div className="">
                        <h1 className='flex items-center gap-1 font-medium text-xl'><SiGoogleclassroom className='w-6 h-6 text-primary-light' /> Create New School</h1>
                        <p className='text-sm'>Add a new school to the system</p>
                    </div>

                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col w-1/2 md:w-[100px]">
                            <label className='font-medium' htmlFor="num">Num:</label>
                            <input
                                {...register("num", { required: "num is required" })}
                                type="number"
                                id="num"
                                placeholder='1-11'
                                className='bg-white outline p-2! rounded-lg w-full'
                            />
                            {errors.num && <span>{errors.num.message}</span>}
                        </div>

                        <div className="flex flex-col w-1/2 md:w-[100px]">
                            <label className='font-medium' htmlFor="letter">Letter:</label>
                            <input
                                {...register("letter", { required: "letter is required" })}
                                type="text"
                                id="letter"
                                placeholder='A-Z'
                                className='bg-white outline p-2! rounded-lg w-full'
                            />
                            {errors.letter && <span>{errors.letter.message}</span>}
                        </div>
                    </div>
                </div>

                <Button className='mt-4! w-[200px] bg-primary-light cursor-pointer text-primary-dark hover:text-secondary-light' type='submit'>
                    <GoPlus className='w-6 h-6' />
                    <p>Create Class</p>
                </Button>
            </form>

            <div className="bg-white rounded-2xl p-3! mt-3! shadow-xl">
                <div className="flex items-center gap-3">
                    <FaSchool className='w-5 h-5 text-primary-light' />
                    <h1 className='col-span-1 text-2xl font-medium'>Classes ({currentSchool?.classes && currentSchool?.classes.length > 0 ? currentSchool?.classes.length : "NaN"})</h1>
                    <Button onClick={() => setShowClasses(state => !state)} className='w-[200px] cursor-pointer'>{showClasses ? "Hide" : "Show"} classes</Button>
                </div>

                {showClasses && <Table>
                    <TableCaption>A list of classes.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-primary-light'>Class</TableHead>
                            <TableHead className='text-primary-light'>Amount of Students</TableHead>
                            <TableHead className="text-right text-primary-light">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentSchool?.classes && currentSchool?.classes.map(classEl => <TableRow key={classEl.id} className=''>
                            <TableCell className='py-3!'>
                                <Link to={`/class/${classEl.id}`}>{classEl.num}{classEl.letter}</Link>
                            </TableCell>

                            <TableCell className='py-3!'>{classEl?.students && classEl?.students.length}</TableCell>

                            <TableCell className='text-right flex justify-end py-3!'>
                                <FaTrashAlt className='cursor-pointer text-red-600 w-8 h-8' onClick={() => handleDeleteClass({ id: classEl.id })} />
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>}
            </div>

            <div className="bg-white rounded-2xl p-3! mt-3! shadow-xl">
                <div className="flex items-center gap-3">
                    <GiTeacher className='w-5 h-5 text-primary-light' />
                    <h1 className='col-span-1 text-2xl font-medium'>Teachers  ({currentSchool?.teachers && currentSchool?.teachers.length && currentSchool?.teachers.length > 0 ? currentSchool?.teachers.length : "NaN"})</h1>
                </div>

                <div className="flex items-center mt-4! gap-3">
                    <Select value={selectedTeacher} onValueChange={handleTeacherChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                        <SelectContent>
                            {teacherList?.filter(teacher => !teacher.schoolId)?.map(teacherItem => <SelectItem key={teacherItem.id} value={teacherItem.id}>{teacherItem.name} {teacherItem.surname}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button className='w-[100px] p-1! bg-primary-light cursor-pointer text-primary-dark hover:text-secondary-light' onClick={handleAddTeacher}>Add Teacher</Button>
                </div>

                <Table>
                    <TableCaption>A list of teachers.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-primary-light'>Name</TableHead>
                            <TableHead className='text-primary-light'>Surname</TableHead>
                            <TableHead className="text-right text-primary-light">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentSchool?.teachers && currentSchool?.teachers.length > 0 && currentSchool?.teachers.map(teacherEl =>
                            <TableRow key={teacherEl.id} className=''>
                                <TableCell className='py-3!'>
                                    <Link to={`/profile/${teacherEl.id}`}>{teacherEl.name}</Link>
                                </TableCell>

                                <TableCell className='py-3!'>{teacherEl.surname}</TableCell>

                                <TableCell className='text-right flex justify-end py-3!'>
                                    <FaTrashAlt className='cursor-pointer text-red-600 w-8 h-8' onClick={() => handleRemoveTeacherFromSchool(teacherEl.id)} />
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </div>


            <div className="flex flex-row items-start justify-between gap-5">
                {/* <div className="flex flex-col min-w-1/2">
                    <div className="flex flex-col">
                        <p>title: {currentSchool?.title}</p>
                        <p>email: {currentSchool?.email}</p>
                        <p>address: {currentSchool?.address}</p>
                        <p>phone: {currentSchool?.phone}</p>
                        <p>amount of classes: {currentSchool?.classes && currentSchool?.classes.length}</p>

                        <Button onClick={() => setShowClasses(state => !state)} className='w-[200px]'>{showClasses ? "Hide" : "Show"} classes</Button>
                    </div>



                    {showClasses && <ul className='flex flex-col gap-3'>
                        {currentSchool?.classes.map(classEl => <li key={classEl.id} className='bg-green-400 flex flex-row items-center justify-between'>
                            <Link to={`/class/${classEl.id}`} className='text-2xl'>{classEl.num} {classEl.letter}</Link>
                            <Button onClick={() => handleDeleteClass({ id: classEl.id })} className='w-[100px]' variant={'destructive'}>delete</Button>
                        </li>)}
                    </ul>}
                </div> */}

                {/* <div className="flex flex-col min-w-1/2 bg-red-600">
                    <h1>teachers</h1>
                    <ul className='h-full flex flex-col gap-3'>
                        {currentSchool?.teachers && currentSchool.teachers.length >= 1 ?
                            currentSchool.teachers.map(teacherItem =>
                                <li key={teacherItem.id}>{teacherItem.name} {teacherItem.surname} <Button onClick={() => handleRemoveTeacherFromSchool(teacherItem.id)}>Delete</Button> </li>
                            )
                            : "No teachers"}
                    </ul>

                    <Select value={selectedTeacher} onValueChange={handleTeacherChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                            {teacherList?.filter(teacher => !teacher.schoolId)?.map(teacherItem => <SelectItem key={teacherItem.id} value={teacherItem.id}>{teacherItem.name} {teacherItem.surname}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddTeacher}>Add Teacher</Button>
                </div> */}
            </div>
        </div>
    )
}

export default SchoolId