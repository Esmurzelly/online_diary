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

type Props = {}

const SchoolId = (props: Props) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [showClasses, setShowClasses] = useState(false);
    const [showTeachers, setShowTeachers] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>();
    const { teacherList } = useSelector((state: RootState) => state.teacher);
    const { loading, message, currentSchool } = useSelector((state: RootState) => state.school);
    const {
        register,
        watch,
        handleSubmit,
        resetField,
        formState: { errors }
    } = useForm<{ num: number, letter: string }>();
    
    // const teacherListSet = new Set(teacherList?.map(teacherItem => teacherItem.id));
    // const availableTeachers = teacherList?.filter(
    //     teacherItem => !teacherListSet.has(teacherItem.id)
    // );

    // console.log('availableTeachers', availableTeachers);

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
        <div className='w-full'>
            <h1>School id {id}</h1>

            <div className="flex flex-row items-start justify-between gap-5">

                <div className="flex flex-col min-w-1/2">
                    <div className="flex flex-col">
                        <p>title: {currentSchool?.title}</p>
                        <p>email: {currentSchool?.email}</p>
                        <p>address: {currentSchool?.address}</p>
                        <p>phone: {currentSchool?.phone}</p>
                        <p>amount of classes: {currentSchool?.classes && currentSchool?.classes.length}</p>

                        <Button onClick={() => setShowClasses(state => !state)} className='w-[200px]'>{showClasses ? "Hide" : "Show"} classes</Button>
                    </div>

                    <form onSubmit={handleSubmit(handleAddClassToSchool)}>
                        <div className="flex flex-col items-end bg-gray-400 p-4">
                            <div className="">
                                <label htmlFor="num">Num:</label>
                                <input
                                    {...register("num", { required: "num is required" })}
                                    type="text"
                                    id="num"
                                    className='bg-white outline'
                                />
                                {errors.num && <span>{errors.num.message}</span>}
                            </div>

                            <div className="">
                                <label htmlFor="letter">Letter:</label>
                                <input
                                    {...register("letter", { required: "letter is required" })}
                                    type="text"
                                    id="letter"
                                    className='bg-white outline'
                                />
                                {errors.letter && <span>{errors.letter.message}</span>}
                            </div>
                        </div>

                        <input type="submit" value="Create" />
                    </form>

                    {showClasses && <ul className='flex flex-col gap-3'>
                        {currentSchool?.classes.map(classEl => <li key={classEl.id} className='bg-green-400 flex flex-row items-center justify-between'>
                            <Link to={`/class/${classEl.id}`} className='text-2xl'>{classEl.num} {classEl.letter}</Link>
                            <Button onClick={() => handleDeleteClass({ id: classEl.id })} className='w-[100px]' variant={'destructive'}>delete</Button>
                        </li>)}
                    </ul>}
                </div>

                <div className="flex flex-col min-w-1/2 bg-red-600">
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
                </div>
            </div>
        </div>
    )
}

export default SchoolId